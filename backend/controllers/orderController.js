import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: 'rzp_test_nXpT7OOHz9G5md',
    key_secret: 'w4Nb4OsnKKnTPfB85nP2Uw2v',
});

// Placing User Order for Frontend
// Backend code
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"; // Ensure this URL is used for redirection
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const amount = (req.body.amount + 2) * 100; // including delivery charge

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `order_rcptid_${newOrder._id}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        // Include the frontend URL in the response
        res.json({
            success: true,
            order_id: order.id,
            orderId: newOrder._id,
            successUrl: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancelUrl: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            // Update the order to mark it as paid
            await orderModel.findByIdAndUpdate(orderId, { paymentStatus: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            // Delete the order if payment is not successful
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed, order deleted" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.json({ success: false, message: "Order verification failed" });
    }
};


//user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//This is the function for cleaning all the data that have failed payment

// const cleanupFailedOrders = async () => {
//     try {
//         const result = await orderModel.deleteMany({ payment: false });
//         console.log(`${result.deletedCount} failed orders removed.`);
//     } catch (error) {
//         console.error("Error removing failed orders:", error);
//     }
// };

// cleanupFailedOrders();

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

export { placeOrder, verifyOrder,userOrders , listOrders,updateStatus};
