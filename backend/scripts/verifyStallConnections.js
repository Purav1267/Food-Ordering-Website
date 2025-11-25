import mongoose from "mongoose";
import stallOwnerModel from "../models/stallOwnerModel.js";
import foodModel from "../models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://puravmalik24:v6TXzCc8YW5lMqxv@cluster0.ubhyssy.mongodb.net/Tomato');
        console.log("MongoDB Connected\n");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const verifyConnections = async () => {
    await connectDB();
    
    try {
        const stalls = ["Smoothie Zone", "Muskan Hotel", "Kathi Junction", "Old Rao Hotel"];
        
        console.log("📋 Verifying Stall Connections:\n");
        
        for (const stallName of stalls) {
            console.log(`🏪 ${stallName}:`);
            
            // Check stall owner
            const owner = await stallOwnerModel.findOne({ stallName: stallName });
            if (owner) {
                console.log(`   ✅ Owner: ${owner.name} (${owner.email})`);
            } else {
                console.log(`   ❌ No owner found`);
            }
            
            // Check menu items
            const items = await foodModel.find({ stall: stallName });
            console.log(`   📦 Menu Items: ${items.length}`);
            
            if (items.length > 0) {
                console.log(`   Sample items:`);
                items.slice(0, 5).forEach((item, idx) => {
                    console.log(`      ${idx + 1}. ${item.name} - ₹${item.price}`);
                });
                if (items.length > 5) {
                    console.log(`      ... and ${items.length - 5} more`);
                }
            } else {
                console.log(`   ⚠️  No menu items found`);
            }
            
            console.log("");
        }
        
        // Check for unlinked items
        console.log("🔍 Checking for unlinked items...\n");
        const allItems = await foodModel.find({});
        const unlinkedItems = allItems.filter(item => !item.stall || item.stall === "");
        console.log(`Found ${unlinkedItems.length} items without a stall assignment`);
        
        if (unlinkedItems.length > 0) {
            console.log("\nUnlinked items (first 10):");
            unlinkedItems.slice(0, 10).forEach((item, idx) => {
                console.log(`   ${idx + 1}. ${item.name} (${item.category})`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verifyConnections();

