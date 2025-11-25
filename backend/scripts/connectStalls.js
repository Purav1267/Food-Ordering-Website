import mongoose from "mongoose";
import stallOwnerModel from "../models/stallOwnerModel.js";
import foodModel from "../models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://puravmalik24:v6TXzCc8YW5lMqxv@cluster0.ubhyssy.mongodb.net/Tomato');
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Connect Smoothie Zone and Muskan Hotel
const connectStalls = async () => {
    await connectDB();
    
    try {
        // Connect Smoothie Zone
        console.log("\n🔗 Connecting Smoothie Zone...");
        const smoothieOwner = await stallOwnerModel.findOne({ email: "smoothie@gmail.com" });
        if (smoothieOwner) {
            smoothieOwner.stallName = "Smoothie Zone";
            await smoothieOwner.save();
            const smoothieItems = await foodModel.find({ stall: "Smoothie Zone" });
            console.log(`✅ Connected smoothie@gmail.com to "Smoothie Zone"`);
            console.log(`   Found ${smoothieItems.length} menu items`);
        } else {
            console.log("❌ smoothie@gmail.com not found");
        }
        
        // Connect Muskan Hotel
        console.log("\n🔗 Connecting Muskan Hotel...");
        const muskanOwner = await stallOwnerModel.findOne({ email: "muskan@gmail.com" });
        if (muskanOwner) {
            muskanOwner.stallName = "Muskan Hotel";
            await muskanOwner.save();
            const muskanItems = await foodModel.find({ stall: "Muskan Hotel" });
            console.log(`✅ Connected muskan@gmail.com to "Muskan Hotel"`);
            console.log(`   Found ${muskanItems.length} menu items`);
        } else {
            console.log("❌ muskan@gmail.com not found");
        }
        
        console.log("\n✅ All connections completed!");
        console.log("\n📧 Login Credentials:");
        console.log("   Smoothie Zone:");
        console.log("      Email: smoothie@gmail.com");
        console.log("      Password: [Your existing password]");
        console.log("   Muskan Hotel:");
        console.log("      Email: muskan@gmail.com");
        console.log("      Password: [Your existing password]");
        console.log("\n🌐 Login at: http://localhost:5175");
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

connectStalls();

