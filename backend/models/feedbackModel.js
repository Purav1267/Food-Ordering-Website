import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    stallName: { type: String, required: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: false },
    photos: { type: Array, default: [] }, // Array of image filenames
    date: { type: Date, default: Date.now }
});

const feedbackModel = mongoose.models.feedback || mongoose.model("feedback", feedbackSchema);
export default feedbackModel;

