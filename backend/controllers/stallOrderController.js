import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import stallOwnerModel from "../models/stallOwnerModel.js";

// Get orders for a specific stall
const getStallOrders = async (req, res) => {
    try {
        // Get the actual stallName from database (more reliable than JWT token)
        const stallOwner = await stallOwnerModel.findById(req.userId);
        if (!stallOwner) {
            return res.json({ success: false, message: "Stall owner not found" });
        }
        
        const stallName = stallOwner.stallName;
        
        // Get all orders
        const allOrders = await orderModel.find({});
        
        // Filter orders that contain items from this stall
        // First, get all food items for this stall to check against
        const stallFoodItems = await foodModel.find({ stall: stallName });
        const stallFoodIds = new Set(stallFoodItems.map(f => f._id.toString()));
        
        const stallOrders = allOrders.filter(order => {
            // Check if stalls array contains this stall name (exact or partial match)
            const hasStallInArray = order.stalls && order.stalls.some(s => {
                if (!s) return false;
                // Exact match
                if (s === stallName) return true;
                // Partial match for variations (e.g., "Old Rao" matches "Old Rao Hotel")
                const sLower = s.toLowerCase();
                const stallNameLower = stallName.toLowerCase();
                return sLower.includes(stallNameLower) || stallNameLower.includes(sLower);
            });
            
            if (hasStallInArray) return true;
            
            // Also check if any food item in the order belongs to this stall
            return order.items.some(item => {
                const itemId = (item.itemId || item._id)?.toString();
                return itemId && stallFoodIds.has(itemId);
            });
        });

        // Populate order details with food information
        const populatedOrders = await Promise.all(
            stallOrders.map(async (order) => {
                const stallItems = [];
                let stallTotal = 0;

                for (const item of order.items) {
                    // Handle both old format (full object) and new format (itemId)
                    const itemId = item.itemId || item._id;
                    const food = await foodModel.findById(itemId);
                    if (food && food.stall === stallName) {
                        const quantity = item.quantity || 1;
                        stallItems.push({
                            ...item,
                            quantity: quantity,
                            foodDetails: {
                                name: food.name,
                                price: food.price,
                                image: food.image
                            }
                        });
                        stallTotal += food.price * quantity;
                    }
                }

                // Get the status for this specific stall
                const stallStatus = order.stallStatuses?.[stallName] || order.status || "Food Processing";
                const stallDeliveryTime = order.stallDeliveryTimes?.[stallName] || null;

                return {
                    ...order.toObject(),
                    stallItems,
                    stallTotal,
                    stallStatus, // Status specific to this stall
                    stallDeliveryTime // Delivery time specific to this stall
                };
            })
        );

        res.json({ success: true, data: populatedOrders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching stall orders" });
    }
};

// Update order status (for stall owner) - only updates this stall's status
const updateStallOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        // Get the stall owner's stall name
        const stallOwner = await stallOwnerModel.findById(req.userId);
        if (!stallOwner || !stallOwner.stallName) {
            return res.json({ success: false, message: "Stall owner not found" });
        }
        
        const stallName = stallOwner.stallName;
        
        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // Check if this stall actually has items in the order
        // First, get all food items for this stall
        const stallFoodItems = await foodModel.find({ stall: stallName });
        const stallFoodIds = new Set(stallFoodItems.map(f => f._id.toString()));
        
        // Check if any item in the order belongs to this stall
        const hasItemsFromStall = order.items.some(item => {
            const itemId = (item.itemId || item._id)?.toString();
            return itemId && stallFoodIds.has(itemId);
        });
        
        // Also check if stall name is in the stalls array (with flexible matching)
        const hasStallInArray = order.stalls && order.stalls.some(s => {
            if (!s) return false;
            // Exact match
            if (s === stallName) return true;
            // Partial match for variations (e.g., "Old Rao" matches "Old Rao Hotel")
            const sLower = s.toLowerCase();
            const stallNameLower = stallName.toLowerCase();
            return sLower.includes(stallNameLower) || stallNameLower.includes(sLower);
        });
        
        // If neither check passes, this stall doesn't have items in this order
        if (!hasItemsFromStall && !hasStallInArray) {
            return res.json({ success: false, message: "This order does not contain items from your stall" });
        }
        
        // If stall is not in the stalls array but has items, add it (for backward compatibility)
        if (!hasStallInArray && hasItemsFromStall) {
            if (!order.stalls) {
                order.stalls = [];
            }
            if (!order.stalls.includes(stallName)) {
                order.stalls.push(stallName);
                await order.save();
            }
            // Initialize stall status if it doesn't exist
            if (!order.stallStatuses) {
                order.stallStatuses = {};
            }
            if (!order.stallStatuses[stallName]) {
                order.stallStatuses[stallName] = "Food Processing";
                await order.save();
            }
        }
        
        // Prevent status change if already delivered for this stall
        const currentStallStatus = order.stallStatuses?.[stallName] || order.status;
        if (currentStallStatus === 'Delivered' && status !== 'Delivered') {
            return res.json({ success: false, message: "Cannot change status after delivery" });
        }
        
        // Update only this stall's status
        const updateData = {
            $set: {
                [`stallStatuses.${stallName}`]: status
            }
        };
        
        // Set delivery time for this stall when marking as delivered
        if (status === 'Delivered') {
            updateData.$set[`stallDeliveryTimes.${stallName}`] = new Date();
        }
        
        // Update overall order status based on all stall statuses
        // If all stalls are delivered, mark overall as delivered
        const updatedStallStatuses = { ...order.stallStatuses, [stallName]: status };
        const allStallsDelivered = order.stalls.every(stall => 
            updatedStallStatuses[stall] === 'Delivered'
        );
        
        if (allStallsDelivered) {
            updateData.$set.status = 'Delivered';
            if (!order.deliveryTime) {
                updateData.$set.deliveryTime = new Date();
            }
        } else {
            // If any stall is out for delivery, overall status is out for delivery
            const anyOutForDelivery = order.stalls.some(stall => 
                updatedStallStatuses[stall] === 'Out for delivery'
            );
            if (anyOutForDelivery) {
                updateData.$set.status = 'Out for delivery';
            }
        }
        
        await orderModel.findByIdAndUpdate(orderId, updateData);
        res.json({ 
            success: true, 
            message: `Status updated for ${stallName}`,
            stallStatus: status
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

export { getStallOrders, updateStallOrderStatus };

