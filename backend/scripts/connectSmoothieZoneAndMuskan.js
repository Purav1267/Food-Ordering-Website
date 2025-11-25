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

// Function to connect a stall owner account to a stall
const connectStall = async (stallName, stallOwnerEmail, createNew = false) => {
    await connectDB();
    
    try {
        let stallOwner;
        
        if (createNew) {
            // Create new stall owner account
            console.log(`\n📝 Creating new stall owner account for ${stallName}...`);
            
            const defaultEmails = {
                "Smoothie Zone": "smoothiezone@example.com",
                "Muskan Hotel": "muskanhotel@example.com"
            };
            
            const defaultPasswords = {
                "Smoothie Zone": "smoothie123",
                "Muskan Hotel": "muskan123"
            };
            
            const email = defaultEmails[stallName] || `${stallName.toLowerCase().replace(/\s+/g, '')}@example.com`;
            const password = defaultPasswords[stallName] || "stall123";
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            stallOwner = new stallOwnerModel({
                name: `${stallName} Owner`,
                email: email,
                password: hashedPassword,
                stallName: stallName,
                phone: "1234567890"
            });
            
            await stallOwner.save();
            console.log("✅ Created new account:");
            console.log(`   Email: ${stallOwner.email}`);
            console.log(`   Password: ${password} (Please change this!)`);
        } else {
            // Find existing stall owner by email
            stallOwner = await stallOwnerModel.findOne({ email: stallOwnerEmail });
            
            if (!stallOwner) {
                console.log(`❌ No stall owner found with email: ${stallOwnerEmail}`);
                console.log("\n📋 Available stall owners:");
                const allOwners = await stallOwnerModel.find({});
                if (allOwners.length === 0) {
                    console.log("   No stall owners found.");
                    console.log(`\n💡 You can create a new account by running:`);
                    console.log(`   node scripts/connectSmoothieZoneAndMuskan.js ${stallName} --create`);
                } else {
                    allOwners.forEach(owner => {
                        console.log(`   - Email: ${owner.email}, Name: ${owner.name}, Current Stall: ${owner.stallName || 'Not set'}`);
                    });
                }
                process.exit(1);
            }

            console.log(`\n✅ Found stall owner: ${stallOwner.name} (${stallOwner.email})`);
            console.log(`   Current stall name: ${stallOwner.stallName || 'None'}`);

            // Check if the stall is already taken by another account
            const existingStall = await stallOwnerModel.findOne({ 
                stallName: stallName,
                _id: { $ne: stallOwner._id }
            });

            if (existingStall) {
                console.log(`\n⚠️  Warning: "${stallName}" is already connected to another account:`);
                console.log(`   Email: ${existingStall.email}, Name: ${existingStall.name}`);
                console.log(`\n   This will update your account to "${stallName}".`);
            }
        }

        // Update the stall owner's stallName
        stallOwner.stallName = stallName;
        await stallOwner.save();
        console.log(`\n✅ Updated stall name to: "${stallName}"`);

        // Verify all menu items for this stall
        const stallMenuItems = await foodModel.find({ stall: stallName });
        console.log(`\n📋 Found ${stallMenuItems.length} menu items for ${stallName}:`);
        
        if (stallMenuItems.length > 0) {
            console.log("\n   Sample Menu Items (first 10):");
            stallMenuItems.slice(0, 10).forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name} - ₹${item.price} (${item.category})`);
            });
            if (stallMenuItems.length > 10) {
                console.log(`   ... and ${stallMenuItems.length - 10} more items`);
            }
        } else {
            console.log("   ⚠️  No menu items found for this stall.");
            console.log("   💡 You can add menu items through the Admin panel or create a script to add them.");
        }

        console.log(`\n✅ Successfully connected ${stallOwner.name}'s account to "${stallName}"`);
        console.log(`   The account can now manage all ${stallMenuItems.length} menu items for ${stallName}.`);
        console.log(`\n📧 Login Credentials:`);
        console.log(`   Email: ${stallOwner.email}`);
        if (createNew) {
            const defaultPasswords = {
                "Smoothie Zone": "smoothie123",
                "Muskan Hotel": "muskan123"
            };
            console.log(`   Password: ${defaultPasswords[stallName] || 'stall123'} (Please change this!)`);
        } else {
            console.log(`   Password: [Your existing password]`);
        }
        console.log(`\n🌐 Login at: http://localhost:5175`);
        
        return stallOwner;
    } catch (error) {
        console.error("Error connecting stall to account:", error);
        if (error.code === 11000) {
            console.error("\n❌ Error: This stall name is already taken by another account.");
            console.error("   Please use a different email or update the existing account.");
        }
        throw error;
    }
};

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    // List all stall owners
    connectDB().then(async () => {
        const allOwners = await stallOwnerModel.find({});
        console.log("\n📋 All stall owner accounts:");
        if (allOwners.length === 0) {
            console.log("   No stall owners found.");
            console.log("\n💡 To create new accounts for Smoothie Zone and Muskan Hotel, run:");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Smoothie Zone\" --create");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Muskan Hotel\" --create");
        } else {
            allOwners.forEach((owner, index) => {
                console.log(`\n   ${index + 1}. Email: ${owner.email}`);
                console.log(`      Name: ${owner.name}`);
                console.log(`      Stall: ${owner.stallName || 'Not set'}`);
                console.log(`      Phone: ${owner.phone || 'Not provided'}`);
            });
            console.log("\n💡 To connect an account to a stall, run:");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Smoothie Zone\" <email>");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Muskan Hotel\" <email>");
            console.log("\n💡 Or create new accounts:");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Smoothie Zone\" --create");
            console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Muskan Hotel\" --create");
        }
        process.exit(0);
    });
} else {
    const stallName = args[0];
    const isCreate = args.includes('--create') || args.includes('-c');
    const email = isCreate ? null : args[1];
    
    if (!isCreate && !email) {
        console.log("❌ Error: Please provide an email address or use --create flag");
        console.log("\nUsage:");
        console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Smoothie Zone\" <email>");
        console.log("   node scripts/connectSmoothieZoneAndMuskan.js \"Smoothie Zone\" --create");
        process.exit(1);
    }
    
    if (stallName !== "Smoothie Zone" && stallName !== "Muskan Hotel") {
        console.log("❌ Error: Stall name must be either 'Smoothie Zone' or 'Muskan Hotel'");
        process.exit(1);
    }
    
    connectStall(stallName, email, isCreate)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

