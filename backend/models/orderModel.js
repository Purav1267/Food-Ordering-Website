import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" }, // Overall order status (deprecated, kept for backward compatibility)
    date: { type: Date, default: Date.now },
    deliveryTime: { type: Date, default: null }, // Time when order was marked as delivered
    payment: { type: Boolean, default: false },
    stalls: { type: Array, default: [] }, // Array of stall names in the order
    stallStatuses: { type: Object, default: {} }, // Object to track status per stall: { "Stall Name": "Food Processing" }
    stallDeliveryTimes: { type: Object, default: {} }, // Object to track delivery time per stall: { "Stall Name": Date }
    stallAcceptance: { type: Object, default: {} } // Object to track acceptance per stall: { "Stall Name": "pending" | "accepted" | "rejected" }
});


const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
