import mongoose from "mongoose";
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

// Menu items for Kathi Junction
const kathiMenuItems = [
    { name: "Aalu Roll", price: 80, category: "Rolls", description: "Delicious potato roll with spices" },
    { name: "Chicken Roll", price: 120, category: "Rolls", description: "Tender chicken wrapped in paratha" },
    { name: "Soya Chaap Roll", price: 100, category: "Rolls", description: "Soya chaap roll with special sauce" },
    { name: "Egg Roll", price: 90, category: "Rolls", description: "Fresh egg roll with vegetables" },
    { name: "Double Egg Roll", price: 110, category: "Rolls", description: "Double egg roll with extra filling" },
    { name: "Peri Peri Chicken Roll", price: 140, category: "Rolls", description: "Spicy peri peri chicken roll" },
    { name: "Dbl Soya Chaap Roll", price: 130, category: "Rolls", description: "Double soya chaap roll" },
    { name: "Mutton Roll", price: 150, category: "Rolls", description: "Tender mutton roll" }
];

const updateKathiMenuItems = async () => {
    await connectDB();
    
    try {
        console.log("Updating menu items for Kathi Junction...\n");
        
        let updated = 0;
        let created = 0;
        let skipped = 0;

        for (const menuItem of kathiMenuItems) {
            // Try to find existing item by name (case insensitive)
            const existing = await foodModel.findOne({ 
                name: { $regex: new RegExp(`^${menuItem.name}$`, 'i') }
            });

            if (existing) {
                // Update existing item
                existing.stall = "Kathi Junction";
                existing.price = menuItem.price;
                existing.category = menuItem.category;
                existing.description = menuItem.description;
                await existing.save();
                console.log(`  ✓ Updated: ${menuItem.name} - ₹${menuItem.price}`);
                updated++;
            } else {
                // Create new item if it doesn't exist
                const newItem = new foodModel({
                    name: menuItem.name,
                    description: menuItem.description,
                    price: menuItem.price,
                    category: menuItem.category,
                    stall: "Kathi Junction",
                    image: "1721329323168food_1.png" // Placeholder image
                });
                await newItem.save();
                console.log(`  ✓ Created: ${menuItem.name} - ₹${menuItem.price}`);
                created++;
            }
        }

        // Remove Kathi Junction from items that shouldn't be there
        const allKathiItems = await foodModel.find({ stall: "Kathi Junction" });
        const validNames = kathiMenuItems.map(item => item.name.toLowerCase());
        
        for (const item of allKathiItems) {
            if (!validNames.includes(item.name.toLowerCase())) {
                // Remove stall assignment if it's not in our menu
                item.stall = "";
                await item.save();
                console.log(`  ⚠ Removed: ${item.name} from Kathi Junction (not in menu)`);
            }
        }

        // Verify final count
        const finalCount = await foodModel.countDocuments({ stall: "Kathi Junction" });
        
        console.log(`\n✅ Summary:`);
        console.log(`   - Updated: ${updated} items`);
        console.log(`   - Created: ${created} items`);
        console.log(`   - Total items for Kathi Junction: ${finalCount}`);
        
        console.log(`\n📋 All menu items for Kathi Junction:`);
        const allItems = await foodModel.find({ stall: "Kathi Junction" });
        allItems.forEach(item => {
            console.log(`   - ${item.name} (₹${item.price})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error updating menu items:", error);
        process.exit(1);
    }
};

updateKathiMenuItems();

