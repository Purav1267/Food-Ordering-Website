import mongoose from "mongoose";
import stallOwnerModel from "../models/stallOwnerModel.js";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
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

const verifyAndFix = async () => {
    await connectDB();
    
    try {
        const stallName = "Old Rao Hotel";
        
        console.log("\n🔍 Verifying Old Rao Hotel connection...\n");
        
        // 1. Check stall owner account
        const stallOwner = await stallOwnerModel.findOne({ email: "oldrao@gmail.com" });
        if (!stallOwner) {
            console.log("❌ No stall owner found with email: oldrao@gmail.com");
            process.exit(1);
        }
        
        console.log("✅ Stall Owner Account:");
        console.log(`   Name: ${stallOwner.name}`);
        console.log(`   Email: ${stallOwner.email}`);
        console.log(`   Current Stall Name: "${stallOwner.stallName}"`);
        
        // Check if stallName matches exactly
        if (stallOwner.stallName !== stallName) {
            console.log(`\n⚠️  Stall name mismatch! Updating to "${stallName}"...`);
            stallOwner.stallName = stallName;
            await stallOwner.save();
            console.log(`✅ Updated stall name to "${stallName}"`);
        } else {
            console.log(`✅ Stall name matches: "${stallName}"`);
        }
        
        // 2. Check menu items
        const menuItems = await foodModel.find({ stall: stallName });
        console.log(`\n📋 Menu Items:`);
        console.log(`   Total items with stall="${stallName}": ${menuItems.length}`);
        
        if (menuItems.length === 0) {
            console.log("   ⚠️  No menu items found! Checking for variations...");
            const variations = await foodModel.find({ 
                $or: [
                    { stall: "Old Rao" },
                    { stall: /old rao/i },
                    { name: { $regex: /tea|coffee|parantha|samosa|choley|poori|pakora/i } }
                ]
            });
            console.log(`   Found ${variations.length} items with similar names/stalls`);
            if (variations.length > 0) {
                console.log("   Updating these items to 'Old Rao Hotel'...");
                for (const item of variations) {
                    if (item.stall && item.stall.toLowerCase().includes('old rao')) {
                        item.stall = stallName;
                        await item.save();
                        console.log(`     ✓ Updated: ${item.name}`);
                    }
                }
            }
        } else {
            console.log("   Sample items:");
            menuItems.slice(0, 5).forEach(item => {
                console.log(`     - ${item.name} (₹${item.price})`);
            });
            if (menuItems.length > 5) {
                console.log(`     ... and ${menuItems.length - 5} more`);
            }
        }
        
        // 3. Check orders
        const allOrders = await orderModel.find({});
        console.log(`\n📦 Orders:`);
        console.log(`   Total orders in system: ${allOrders.length}`);
        
        const oldRaoOrders = allOrders.filter(order => {
            return order.stalls && order.stalls.some(s => 
                s && s.toLowerCase().includes('old rao')
            );
        });
        
        console.log(`   Orders with Old Rao items: ${oldRaoOrders.length}`);
        
        // Update orders to use exact stall name
        let updatedOrders = 0;
        for (const order of allOrders) {
            if (order.stalls && order.stalls.length > 0) {
                const hasOldRao = order.stalls.some(s => 
                    s && s.toLowerCase().includes('old rao') && s !== stallName
                );
                if (hasOldRao) {
                    order.stalls = order.stalls.map(s => {
                        if (s && s.toLowerCase().includes('old rao') && s !== stallName) {
                            return stallName;
                        }
                        return s;
                    });
                    await order.save();
                    updatedOrders++;
                }
            }
        }
        
        if (updatedOrders > 0) {
            console.log(`   ✅ Updated ${updatedOrders} orders to use exact stall name`);
        }
        
        // 4. Final verification
        console.log(`\n✅ Final Status:`);
        console.log(`   Stall Owner: ${stallOwner.name} (${stallOwner.email})`);
        console.log(`   Stall Name: "${stallOwner.stallName}"`);
        console.log(`   Menu Items: ${menuItems.length} items`);
        console.log(`   Orders: ${oldRaoOrders.length} orders`);
        
        console.log(`\n💡 IMPORTANT: The stall owner needs to LOG OUT and LOG BACK IN`);
        console.log(`   to get a new JWT token with the updated stall name.`);
        console.log(`\n   Login at: http://localhost:5175`);
        console.log(`   Email: ${stallOwner.email}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verifyAndFix();

