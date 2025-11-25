import feedbackModel from "../models/feedbackModel.js";
import fs from 'fs';
import { updateItemRating } from "./ratingController.js";

// Add feedback
const addFeedback = async (req, res) => {
    try {
        const { userId, orderId, itemId, itemName, stallName, rating, text } = req.body;
        
        // Get uploaded photos
        const photos = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                photos.push(file.filename);
            });
        }

        const newFeedback = new feedbackModel({
            userId,
            orderId,
            itemId,
            itemName,
            stallName: stallName || "",
            rating: parseInt(rating),
            text: text || "",
            photos
        });

        await newFeedback.save();
        
        // Update item rating
        await updateItemRating(itemId);
        
        res.json({ success: true, message: "Feedback submitted successfully", data: newFeedback });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error submitting feedback" });
    }
};

// Get feedbacks for a specific food item
const getItemFeedbacks = async (req, res) => {
    try {
        const { itemId } = req.params;
        const feedbacks = await feedbackModel.find({ itemId }).sort({ date: -1 });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching feedbacks" });
    }
};

// Get feedbacks for a stall
const getStallFeedbacks = async (req, res) => {
    try {
        const { stallName } = req.params;
        const feedbacks = await feedbackModel.find({ stallName }).sort({ date: -1 });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching feedbacks" });
    }
};

// Get user's feedbacks
const getUserFeedbacks = async (req, res) => {
    try {
        const { userId } = req.params;
        const feedbacks = await feedbackModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching feedbacks" });
    }
};

// Check if user has already given feedback for an item in an order
const checkFeedbackExists = async (req, res) => {
    try {
        const { userId, orderId, itemId } = req.query;
        const feedback = await feedbackModel.findOne({ userId, orderId, itemId });
        res.json({ success: true, exists: !!feedback, data: feedback });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error checking feedback" });
    }
};

export { addFeedback, getItemFeedbacks, getStallFeedbacks, getUserFeedbacks, checkFeedbackExists };

