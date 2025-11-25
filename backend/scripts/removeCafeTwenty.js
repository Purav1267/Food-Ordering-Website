import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://puravmalik24:v6TXzCc8YW5lMqxv@cluster0.ubhyssy.mongodb.net/Tomato');
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const removeCafeTwenty = async () => {
    await connectDB();
    
    try {
        const stallName = "Cafe Twenty";
        console.log(`Removing all items for ${stallName}...`);
        
        // Remove all food items for Cafe Twenty
        const deleteResult = await foodModel.deleteMany({ stall: stallName });
        console.log(`Removed ${deleteResult.deletedCount} food items for ${stallName}`);
        
        console.log(`\n✅ Successfully removed all items for ${stallName}!`);
        console.log("Note: You also need to remove Cafe Twenty from:");
        console.log("  1. frontend/src/assets/assets.js (stalls_list)");
        console.log("  2. Admin/src/components/pages/Add/Add.jsx (stall dropdown)");
        
        process.exit(0);
    } catch (error) {
        console.error("Error removing Cafe Twenty:", error);
        process.exit(1);
    }
};

removeCafeTwenty();

