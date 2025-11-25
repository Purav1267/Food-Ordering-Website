import userModel from "../models/userModel.js";
import stallOwnerModel from "../models/stallOwnerModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password'); // Exclude password
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                // Get user's order count and total spent
                const orders = await orderModel.find({ userId: user._id });
                const totalOrders = orders.length;
                const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
                
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user._id ? user._id.getTimestamp() : new Date(),
                    totalOrders,
                    totalSpent,
                    cartItemsCount: Object.keys(user.cartData || {}).length
                };
            })
        );
        
        res.json({ success: true, data: usersWithStats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching users" });
    }
};

// Get all stalls/stall owners (Admin only)
const getAllStalls = async (req, res) => {
    try {
        const stalls = await stallOwnerModel.find({}).select('-password'); // Exclude password
        const stallsWithStats = await Promise.all(
            stalls.map(async (stall) => {
                // Get stall's menu items count
                const menuItems = await foodModel.find({ stall: stall.stallName });
                const menuItemsCount = menuItems.length;
                
                // Get stall's orders count and revenue
                const allOrders = await orderModel.find({});
                const stallOrders = allOrders.filter(order => 
                    order.stalls && order.stalls.includes(stall.stallName)
                );
                const totalOrders = stallOrders.length;
                const revenue = stallOrders
                    .filter(order => order.status === 'Delivered')
                    .reduce((sum, order) => {
                        // Calculate stall's portion of the order
                        let stallTotal = 0;
                        if (order.items) {
                            order.items.forEach(item => {
                                const itemId = item.itemId || item._id;
                                const foodItem = menuItems.find(f => f._id.toString() === itemId?.toString());
                                if (foodItem) {
                                    stallTotal += foodItem.price * (item.quantity || 1);
                                }
                            });
                        }
                        return sum + stallTotal;
                    }, 0);
                
                return {
                    _id: stall._id,
                    name: stall.name,
                    email: stall.email,
                    stallName: stall.stallName,
                    phone: stall.phone || 'N/A',
                    createdAt: stall.createdAt || (stall._id ? stall._id.getTimestamp() : new Date()),
                    menuItemsCount,
                    totalOrders,
                    revenue
                };
            })
        );
        
        res.json({ success: true, data: stallsWithStats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching stalls" });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting user" });
    }
};

// Delete stall (Admin only)
const deleteStall = async (req, res) => {
    try {
        const { stallId } = req.body;
        const stall = await stallOwnerModel.findById(stallId);
        if (stall) {
            // Also delete all menu items associated with this stall
            await foodModel.deleteMany({ stall: stall.stallName });
        }
        await stallOwnerModel.findByIdAndDelete(stallId);
        res.json({ success: true, message: "Stall deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting stall" });
    }
};

export { getAllUsers, getAllStalls, deleteUser, deleteStall };

