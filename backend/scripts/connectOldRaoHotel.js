import mongoose from "mongoose";
import stallOwnerModel from "../models/stallOwnerModel.js";
import foodModel from "../models/foodModel.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

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

// Function to connect a stall owner account to Old Rao Hotel
const connectToOldRaoHotel = async (stallOwnerEmail, createNew = false) => {
    await connectDB();
    
    try {
        let stallOwner;
        
        if (createNew) {
            // Create new stall owner account
            console.log("\n📝 Creating new stall owner account for Old Rao Hotel...");
            
            const hashedPassword = await bcrypt.hash("oldrao123", 10); // Default password
            
            stallOwner = new stallOwnerModel({
                name: "Old Rao Hotel Owner",
                email: "oldraohotel@example.com",
                password: hashedPassword,
                stallName: "Old Rao Hotel",
                phone: "1234567890"
            });
            
            await stallOwner.save();
            console.log("✅ Created new account:");
            console.log(`   Email: ${stallOwner.email}`);
            console.log(`   Password: oldrao123 (Please change this!)`);
        } else {
            // Find existing stall owner by email
            stallOwner = await stallOwnerModel.findOne({ email: stallOwnerEmail });
            
            if (!stallOwner) {
                console.log(`❌ No stall owner found with email: ${stallOwnerEmail}`);
                console.log("\n📋 Available stall owners:");
                const allOwners = await stallOwnerModel.find({});
                if (allOwners.length === 0) {
                    console.log("   No stall owners found.");
                    console.log("\n💡 You can create a new account by running:");
                    console.log("   node scripts/connectOldRaoHotel.js --create");
                } else {
                    allOwners.forEach(owner => {
                        console.log(`   - Email: ${owner.email}, Name: ${owner.name}, Current Stall: ${owner.stallName}`);
                    });
                }
                process.exit(1);
            }

            console.log(`\n✅ Found stall owner: ${stallOwner.name} (${stallOwner.email})`);
            console.log(`   Current stall name: ${stallOwner.stallName || 'None'}`);

            // Check if "Old Rao Hotel" is already taken by another account
            const existingOldRao = await stallOwnerModel.findOne({ 
                stallName: "Old Rao Hotel",
                _id: { $ne: stallOwner._id }
            });

            if (existingOldRao) {
                console.log(`\n⚠️  Warning: "Old Rao Hotel" is already connected to another account:`);
                console.log(`   Email: ${existingOldRao.email}, Name: ${existingOldRao.name}`);
                console.log(`\n   This will update your account to "Old Rao Hotel".`);
            }
        }

        // Update the stall owner's stallName to "Old Rao Hotel"
        stallOwner.stallName = "Old Rao Hotel";
        await stallOwner.save();
        console.log(`\n✅ Updated stall name to: "Old Rao Hotel"`);

        // Verify all menu items for Old Rao Hotel
        const oldRaoMenuItems = await foodModel.find({ stall: "Old Rao Hotel" });
        console.log(`\n📋 Found ${oldRaoMenuItems.length} menu items for Old Rao Hotel:`);
        
        if (oldRaoMenuItems.length > 0) {
            console.log("\n   Menu Items:");
            oldRaoMenuItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name} - ₹${item.price} (${item.category})`);
            });
        } else {
            console.log("   ⚠️  No menu items found! Please run restoreOldRaoMenu.js first.");
        }

        // Verify all items are properly linked
        const unlinkedItems = await foodModel.find({ 
            $or: [
                { name: { $regex: /tea|coffee|parantha|samosa|choley|poori|pakora/i } },
                { category: { $regex: /deserts|pure veg/i } }
            ],
            stall: { $ne: "Old Rao Hotel" }
        });

        if (unlinkedItems.length > 0) {
            console.log(`\n⚠️  Found ${unlinkedItems.length} items that might belong to Old Rao Hotel but aren't linked:`);
            unlinkedItems.slice(0, 10).forEach(item => {
                console.log(`   - ${item.name} (Current stall: ${item.stall || 'None'})`);
            });
            if (unlinkedItems.length > 10) {
                console.log(`   ... and ${unlinkedItems.length - 10} more`);
            }
        }

        console.log(`\n✅ Successfully connected ${stallOwner.name}'s account to "Old Rao Hotel"`);
        console.log(`   The account can now manage all ${oldRaoMenuItems.length} menu items for Old Rao Hotel.`);
        console.log(`\n📧 Login Credentials:`);
        console.log(`   Email: ${stallOwner.email}`);
        if (createNew) {
            console.log(`   Password: oldrao123 (Please change this!)`);
        } else {
            console.log(`   Password: [Your existing password]`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error connecting stall to account:", error);
        if (error.code === 11000) {
            console.error("\n❌ Error: This stall name is already taken by another account.");
            console.error("   Please use a different email or update the existing account.");
        }
        process.exit(1);
    }
};

// Main execution
const args = process.argv.slice(2);

if (args.includes('--create') || args.includes('-c')) {
    // Create new account
    connectToOldRaoHotel(null, true);
} else if (args.length > 0) {
    // Connect existing account
    const email = args[0];
    connectToOldRaoHotel(email, false);
} else {
    // List all stall owners
    connectDB().then(async () => {
        const allOwners = await stallOwnerModel.find({});
        console.log("\n📋 All stall owner accounts:");
        if (allOwners.length === 0) {
            console.log("   No stall owners found.");
            console.log("\n💡 To create a new account for Old Rao Hotel, run:");
            console.log("   node scripts/connectOldRaoHotel.js --create");
        } else {
            allOwners.forEach((owner, index) => {
                console.log(`\n   ${index + 1}. Email: ${owner.email}`);
                console.log(`      Name: ${owner.name}`);
                console.log(`      Stall: ${owner.stallName || 'Not set'}`);
                console.log(`      Phone: ${owner.phone || 'Not provided'}`);
            });
            console.log("\n💡 To connect an account to Old Rao Hotel, run:");
            console.log("   node scripts/connectOldRaoHotel.js <email>");
            console.log("\n💡 Or create a new account:");
            console.log("   node scripts/connectOldRaoHotel.js --create");
        }
        process.exit(0);
    });
}

