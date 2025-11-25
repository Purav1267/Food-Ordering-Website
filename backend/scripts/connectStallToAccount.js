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

// Function to connect a stall owner account to Kathi Junction
const connectToKathiJunction = async (stallOwnerEmail) => {
    await connectDB();
    
    try {
        // Find the stall owner by email
        const stallOwner = await stallOwnerModel.findOne({ email: stallOwnerEmail });
        
        if (!stallOwner) {
            console.log(`❌ No stall owner found with email: ${stallOwnerEmail}`);
            console.log("\n📋 Available stall owners:");
            const allOwners = await stallOwnerModel.find({});
            allOwners.forEach(owner => {
                console.log(`  - Email: ${owner.email}, Name: ${owner.name}, Current Stall: ${owner.stallName}`);
            });
            process.exit(1);
        }

        console.log(`\n✅ Found stall owner: ${stallOwner.name} (${stallOwner.email})`);
        console.log(`   Current stall name: ${stallOwner.stallName}`);

        // Check if "Kathi Junction" is already taken by another account
        const existingKathi = await stallOwnerModel.findOne({ 
            stallName: "Kathi Junction",
            _id: { $ne: stallOwner._id }
        });

        if (existingKathi) {
            console.log(`\n⚠️  Warning: "Kathi Junction" is already connected to another account:`);
            console.log(`   Email: ${existingKathi.email}, Name: ${existingKathi.name}`);
            console.log(`\n   Do you want to proceed? This will update your account to "Kathi Junction".`);
            // For script, we'll proceed - in production you might want to ask for confirmation
        }

        // Update the stall owner's stallName to "Kathi Junction"
        stallOwner.stallName = "Kathi Junction";
        await stallOwner.save();
        console.log(`\n✅ Updated stall name to: "Kathi Junction"`);

        // Verify all menu items for Kathi Junction
        const kathiMenuItems = await foodModel.find({ stall: "Kathi Junction" });
        console.log(`\n📋 Found ${kathiMenuItems.length} menu items for Kathi Junction:`);
        kathiMenuItems.forEach(item => {
            console.log(`   - ${item.name} (₹${item.price})`);
        });

        // Check if there are any menu items that should be linked but aren't
        const allKathiItems = await foodModel.find({ 
            $or: [
                { name: { $regex: /roll/i } },
                { category: { $regex: /roll/i } }
            ]
        });

        const unlinkedItems = allKathiItems.filter(item => !item.stall || item.stall !== "Kathi Junction");
        if (unlinkedItems.length > 0) {
            console.log(`\n⚠️  Found ${unlinkedItems.length} items that might belong to Kathi Junction but aren't linked:`);
            unlinkedItems.forEach(item => {
                console.log(`   - ${item.name} (Current stall: ${item.stall || 'None'})`);
            });
        }

        console.log(`\n✅ Successfully connected ${stallOwner.name}'s account to "Kathi Junction"`);
        console.log(`   The account can now manage all ${kathiMenuItems.length} menu items for Kathi Junction.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error connecting stall to account:", error);
        process.exit(1);
    }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log("Usage: node scripts/connectStallToAccount.js <stall_owner_email>");
    console.log("\nExample: node scripts/connectStallToAccount.js owner@example.com");
    console.log("\nOr run without email to see all stall owners:");
    connectDB().then(async () => {
        const allOwners = await stallOwnerModel.find({});
        console.log("\n📋 All stall owner accounts:");
        if (allOwners.length === 0) {
            console.log("   No stall owners found. Please create an account first.");
        } else {
            allOwners.forEach((owner, index) => {
                console.log(`   ${index + 1}. Email: ${owner.email}`);
                console.log(`      Name: ${owner.name}`);
                console.log(`      Stall: ${owner.stallName}`);
                console.log(`      Phone: ${owner.phone || 'Not provided'}`);
                console.log("");
            });
        }
        process.exit(0);
    });
} else {
    connectToKathiJunction(email);
}

