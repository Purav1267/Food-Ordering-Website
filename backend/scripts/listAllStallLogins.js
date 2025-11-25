import mongoose from "mongoose";
import stallOwnerModel from "../models/stallOwnerModel.js";
import { connectDB } from "../config/db.js";

const listAllStallLogins = async () => {
    try {
        await connectDB();
        
        console.log("\n📋 All Stall Owner Login Details\n");
        console.log("=" .repeat(60));
        
        const stalls = await stallOwnerModel.find({}).sort({ stallName: 1 });
        
        if (stalls.length === 0) {
            console.log("❌ No stall owners found in the database.");
            process.exit(0);
        }
        
        stalls.forEach((stall, index) => {
            console.log(`\n${index + 1}. ${stall.stallName || "No Stall Assigned"}`);
            console.log(`   Name: ${stall.name}`);
            console.log(`   Email: ${stall.email}`);
            console.log(`   Phone: ${stall.phone || "N/A"}`);
            console.log(`   Stall Name: ${stall.stallName || "Not assigned"}`);
            console.log(`   Created: ${stall.createdAt || "N/A"}`);
        });
        
        console.log("\n" + "=".repeat(60));
        console.log(`\n✅ Total Stalls: ${stalls.length}`);
        console.log("\n💡 Note: Passwords are encrypted and cannot be retrieved.");
        console.log("   If you need to reset a password, you'll need to update it through the database or create a new account.");
        console.log("\n🌐 Login at: http://localhost:5175");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

listAllStallLogins();

