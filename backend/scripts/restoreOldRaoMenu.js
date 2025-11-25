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

// Complete Old Rao Hotel menu
const oldRaoMenu = [
    // Hot Beverages
    { name: "Tea (Ginger, Elichi)", price: 30, category: "Deserts", description: "Hot tea with ginger and cardamom" },
    { name: "Kulhad Masala Chai", price: 40, category: "Deserts", description: "Traditional masala chai in kulhad" },
    { name: "Black Tea", price: 35, category: "Deserts", description: "Strong black tea" },
    { name: "Coffee", price: 75, category: "Deserts", description: "Hot coffee" },
    { name: "Black Coffee", price: 65, category: "Deserts", description: "Strong black coffee" },
    { name: "Espresso without milk", price: 99, category: "Deserts", description: "Pure espresso shot" },
    { name: "Americano without milk", price: 120, category: "Deserts", description: "Americano coffee" },
    { name: "Caffe China with milk", price: 140, category: "Deserts", description: "Caffe china with milk" },
    { name: "Caffe Latte", price: 150, category: "Deserts", description: "Smooth caffe latte" },
    { name: "Dark Mocha with milk", price: 200, category: "Deserts", description: "Rich dark mocha" },
    { name: "Caramel Coffee without milk", price: 200, category: "Deserts", description: "Caramel flavored coffee" },
    { name: "Hazelnut with milk", price: 200, category: "Deserts", description: "Hazelnut coffee with milk" },
    { name: "Vanilla Latte with milk", price: 200, category: "Deserts", description: "Vanilla latte" },
    
    // Cold Beverages
    { name: "Cold Coffee", price: 150, category: "Deserts", description: "Refreshing cold coffee" },
    { name: "Cold Coffee With Vanilla Ice-cream", price: 185, category: "Deserts", description: "Cold coffee with vanilla ice cream" },
    { name: "Lassi Sweet", price: 110, category: "Deserts", description: "Sweet lassi" },
    { name: "Lassi Salted", price: 110, category: "Deserts", description: "Salted lassi" },
    { name: "Frappe Delight", price: 160, category: "Deserts", description: "Delicious frappe" },
    { name: "Ice Americano without milk", price: 140, category: "Deserts", description: "Iced americano" },
    { name: "Ice Latte", price: 160, category: "Deserts", description: "Iced latte" },
    { name: "Dark Chocolate", price: 200, category: "Deserts", description: "Rich dark chocolate drink" },
    
    // Parantha Special
    { name: "Onion Parantha", price: 125, category: "Pure Veg", description: "Crispy onion parantha" },
    { name: "Gobhi Parantha", price: 125, category: "Pure Veg", description: "Cauliflower stuffed parantha" },
    { name: "Aloo Pyaz Parantha", price: 125, category: "Pure Veg", description: "Potato and onion parantha" },
    { name: "Paneer Parantha", price: 145, category: "Pure Veg", description: "Paneer stuffed parantha" },
    { name: "Aloo Parantha", price: 125, category: "Pure Veg", description: "Potato stuffed parantha" },
    { name: "Mix Parantha", price: 135, category: "Pure Veg", description: "Mixed vegetable parantha" },
    
    // Parantha with Dahi
    { name: "Onion Parantha with Dahi", price: 165, category: "Pure Veg", description: "Onion parantha served with yogurt" },
    { name: "Gobhi Parantha with Dahi", price: 165, category: "Pure Veg", description: "Gobhi parantha served with yogurt" },
    { name: "Aloo Pyaz Parantha with Dahi", price: 165, category: "Pure Veg", description: "Aloo pyaz parantha served with yogurt" },
    { name: "Paneer Parantha with Dahi", price: 185, category: "Pure Veg", description: "Paneer parantha served with yogurt" },
    { name: "Aloo Parantha with Dahi", price: 165, category: "Pure Veg", description: "Aloo parantha served with yogurt" },
    { name: "Mix Parantha with Dahi", price: 175, category: "Pure Veg", description: "Mix parantha served with yogurt" },
    
    // Indian Snacks
    { name: "Samosa", price: 35, category: "Pure Veg", description: "Crispy samosa" },
    { name: "Choley Bhature (2 Pcs)", price: 200, category: "Pure Veg", description: "Chickpea curry with bhature" },
    { name: "Poori / Bhaji", price: 200, category: "Pure Veg", description: "Poori with vegetable curry" },
    { name: "Poori / Bhaji With Halwa (4 Pcs)", price: 200, category: "Pure Veg", description: "Poori bhaji with halwa" },
    { name: "Extra Poori (2 pc)", price: 70, category: "Pure Veg", description: "Extra poori" },
    { name: "Extra Bhaji (Subji)", price: 55, category: "Pure Veg", description: "Extra vegetable curry" },
    { name: "Extra Bhature (1 pc)", price: 70, category: "Pure Veg", description: "Extra bhature" },
    { name: "Extra Choley", price: 60, category: "Pure Veg", description: "Extra chickpea curry" },
    { name: "Pav Bhaji", price: 175, category: "Pure Veg", description: "Spicy pav bhaji" },
    { name: "Extra Pav (1pc)", price: 75, category: "Pure Veg", description: "Extra pav" },
    { name: "Extra Bhaji", price: 55, category: "Pure Veg", description: "Extra bhaji" },
    { name: "Aloo Tikki (Live Counter)", price: 80, category: "Pure Veg", description: "Fresh aloo tikki" },
    
    // Pakora Special
    { name: "Paneer Pakora", price: 180, category: "Pure Veg", description: "Crispy paneer pakora" },
    { name: "Mix Pakora Platter", price: 150, category: "Pure Veg", description: "Assorted pakora platter" }
];

const restoreOldRaoMenu = async () => {
    await connectDB();
    
    try {
        const stallName = "Old Rao Hotel";
        console.log(`Restoring complete menu for ${stallName}...`);
        
        // First, remove all existing items for Old Rao Hotel
        const deleteResult = await foodModel.deleteMany({ stall: stallName });
        console.log(`Removed ${deleteResult.deletedCount} existing items`);
        
        // Add all items
        let addedCount = 0;
        for (const item of oldRaoMenu) {
            const food = new foodModel({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                stall: stallName,
                image: "1721329323168food_1.png" // Placeholder
            });
            
            await food.save();
            addedCount++;
            console.log(`  ✓ Added: ${item.name} - ₹${item.price}`);
        }
        
        console.log(`\n✅ Successfully restored ${addedCount} items for ${stallName}!`);
        process.exit(0);
    } catch (error) {
        console.error("Error restoring menu:", error);
        process.exit(1);
    }
};

restoreOldRaoMenu();

