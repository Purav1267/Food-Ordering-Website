import express from "express";
import { addFeedback, getItemFeedbacks, getStallFeedbacks, getUserFeedbacks, checkFeedbackExists } from "../controllers/feedbackController.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feedbackRouter = express.Router();

// Create feedback uploads directory if it doesn't exist
const feedbackDir = path.join(__dirname, '../uploads/feedback');
if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir, { recursive: true });
}

// Image storage for feedback photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, feedbackDir);
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

feedbackRouter.post("/add", upload.array("photos", 5), addFeedback); // Max 5 photos
feedbackRouter.get("/item/:itemId", getItemFeedbacks);
feedbackRouter.get("/stall/:stallName", getStallFeedbacks);
feedbackRouter.get("/user/:userId", getUserFeedbacks);
feedbackRouter.get("/check", checkFeedbackExists);

export default feedbackRouter;
