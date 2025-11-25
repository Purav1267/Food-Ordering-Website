import axios from 'axios';

const url = "http://localhost:4000";

const stallMenus = {
    "Kathi Junction": [
        { name: "Aalu Roll", price: 80, category: "Rolls", description: "Delicious potato roll with spices", image: "1721329323168food_1.png" },
        { name: "Chicken Roll", price: 120, category: "Rolls", description: "Tender chicken wrapped in paratha", image: "1721329323168food_1.png" },
        { name: "Soya Chaap Roll", price: 100, category: "Rolls", description: "Soya chaap roll with special sauce", image: "1721329323168food_1.png" },
        { name: "Egg Roll", price: 90, category: "Rolls", description: "Fresh egg roll with vegetables", image: "1721329323168food_1.png" },
        { name: "Double Egg Roll", price: 110, category: "Rolls", description: "Double egg roll with extra filling", image: "1721329323168food_1.png" },
        { name: "Peri Peri Chicken Roll", price: 140, category: "Rolls", description: "Spicy peri peri chicken roll", image: "1721329323168food_1.png" },
        { name: "Dbl Soya Chaap Roll", price: 130, category: "Rolls", description: "Double soya chaap roll", image: "1721329323168food_1.png" },
        { name: "Mutton Roll", price: 150, category: "Rolls", description: "Tender mutton roll", image: "1721329323168food_1.png" }
    ],
    "Old Rao Hotel": [
        // Hot Beverages
        { name: "Tea (Ginger, Elichi)", price: 30, category: "Deserts", description: "Hot tea with ginger and cardamom", image: "1721329323168food_1.png" },
        { name: "Kulhad Masala Chai", price: 40, category: "Deserts", description: "Traditional masala chai in kulhad", image: "1721329323168food_1.png" },
        { name: "Black Tea", price: 35, category: "Deserts", description: "Strong black tea", image: "1721329323168food_1.png" },
        { name: "Coffee", price: 75, category: "Deserts", description: "Hot coffee", image: "1721329323168food_1.png" },
        { name: "Black Coffee", price: 65, category: "Deserts", description: "Strong black coffee", image: "1721329323168food_1.png" },
        { name: "Espresso without milk", price: 99, category: "Deserts", description: "Pure espresso shot", image: "1721329323168food_1.png" },
        { name: "Americano without milk", price: 120, category: "Deserts", description: "Americano coffee", image: "1721329323168food_1.png" },
        { name: "Caffe China with milk", price: 140, category: "Deserts", description: "Caffe china with milk", image: "1721329323168food_1.png" },
        { name: "Caffe Latte", price: 150, category: "Deserts", description: "Smooth caffe latte", image: "1721329323168food_1.png" },
        { name: "Dark Mocha with milk", price: 200, category: "Deserts", description: "Rich dark mocha", image: "1721329323168food_1.png" },
        { name: "Caramel Coffee without milk", price: 200, category: "Deserts", description: "Caramel flavored coffee", image: "1721329323168food_1.png" },
        { name: "Hazelnut with milk", price: 200, category: "Deserts", description: "Hazelnut coffee with milk", image: "1721329323168food_1.png" },
        { name: "Vanilla Latte with milk", price: 200, category: "Deserts", description: "Vanilla latte", image: "1721329323168food_1.png" },
        
        // Cold Beverages
        { name: "Cold Coffee", price: 150, category: "Deserts", description: "Refreshing cold coffee", image: "1721329323168food_1.png" },
        { name: "Cold Coffee With Vanilla Ice-cream", price: 185, category: "Deserts", description: "Cold coffee with vanilla ice cream", image: "1721329323168food_1.png" },
        { name: "Lassi Sweet", price: 110, category: "Deserts", description: "Sweet lassi", image: "1721329323168food_1.png" },
        { name: "Lassi Salted", price: 110, category: "Deserts", description: "Salted lassi", image: "1721329323168food_1.png" },
        { name: "Frappe Delight", price: 160, category: "Deserts", description: "Delicious frappe", image: "1721329323168food_1.png" },
        { name: "Ice Americano without milk", price: 140, category: "Deserts", description: "Iced americano", image: "1721329323168food_1.png" },
        { name: "Ice Latte", price: 160, category: "Deserts", description: "Iced latte", image: "1721329323168food_1.png" },
        { name: "Dark Chocolate", price: 200, category: "Deserts", description: "Rich dark chocolate drink", image: "1721329323168food_1.png" },
        
        // Parantha Special
        { name: "Onion Parantha", price: 125, category: "Pure Veg", description: "Crispy onion parantha", image: "1721329323168food_1.png" },
        { name: "Gobhi Parantha", price: 125, category: "Pure Veg", description: "Cauliflower stuffed parantha", image: "1721329323168food_1.png" },
        { name: "Aloo Pyaz Parantha", price: 125, category: "Pure Veg", description: "Potato and onion parantha", image: "1721329323168food_1.png" },
        { name: "Paneer Parantha", price: 145, category: "Pure Veg", description: "Paneer stuffed parantha", image: "1721329323168food_1.png" },
        { name: "Aloo Parantha", price: 125, category: "Pure Veg", description: "Potato stuffed parantha", image: "1721329323168food_1.png" },
        { name: "Mix Parantha", price: 135, category: "Pure Veg", description: "Mixed vegetable parantha", image: "1721329323168food_1.png" },
        
        // Parantha with Dahi
        { name: "Onion Parantha with Dahi", price: 165, category: "Pure Veg", description: "Onion parantha served with yogurt", image: "1721329323168food_1.png" },
        { name: "Gobhi Parantha with Dahi", price: 165, category: "Pure Veg", description: "Gobhi parantha served with yogurt", image: "1721329323168food_1.png" },
        { name: "Aloo Pyaz Parantha with Dahi", price: 165, category: "Pure Veg", description: "Aloo pyaz parantha served with yogurt", image: "1721329323168food_1.png" },
        { name: "Paneer Parantha with Dahi", price: 185, category: "Pure Veg", description: "Paneer parantha served with yogurt", image: "1721329323168food_1.png" },
        { name: "Aloo Parantha with Dahi", price: 165, category: "Pure Veg", description: "Aloo parantha served with yogurt", image: "1721329323168food_1.png" },
        { name: "Mix Parantha with Dahi", price: 175, category: "Pure Veg", description: "Mix parantha served with yogurt", image: "1721329323168food_1.png" },
        
        // Indian Snacks
        { name: "Samosa", price: 35, category: "Pure Veg", description: "Crispy samosa", image: "1721329323168food_1.png" },
        { name: "Choley Bhature (2 Pcs)", price: 200, category: "Pure Veg", description: "Chickpea curry with bhature", image: "1721329323168food_1.png" },
        { name: "Poori / Bhaji", price: 200, category: "Pure Veg", description: "Poori with vegetable curry", image: "1721329323168food_1.png" },
        { name: "Poori / Bhaji With Halwa (4 Pcs)", price: 200, category: "Pure Veg", description: "Poori bhaji with halwa", image: "1721329323168food_1.png" },
        { name: "Extra Poori (2 pc)", price: 70, category: "Pure Veg", description: "Extra poori", image: "1721329323168food_1.png" },
        { name: "Extra Bhaji (Subji)", price: 55, category: "Pure Veg", description: "Extra vegetable curry", image: "1721329323168food_1.png" },
        { name: "Extra Bhature (1 pc)", price: 70, category: "Pure Veg", description: "Extra bhature", image: "1721329323168food_1.png" },
        { name: "Extra Choley", price: 60, category: "Pure Veg", description: "Extra chickpea curry", image: "1721329323168food_1.png" },
        { name: "Pav Bhaji", price: 175, category: "Pure Veg", description: "Spicy pav bhaji", image: "1721329323168food_1.png" },
        { name: "Extra Pav (1pc)", price: 75, category: "Pure Veg", description: "Extra pav", image: "1721329323168food_1.png" },
        { name: "Extra Bhaji", price: 55, category: "Pure Veg", description: "Extra bhaji", image: "1721329323168food_1.png" },
        { name: "Aloo Tikki (Live Counter)", price: 80, category: "Pure Veg", description: "Fresh aloo tikki", image: "1721329323168food_1.png" },
        
        // Pakora Special
        { name: "Paneer Pakora", price: 180, category: "Pure Veg", description: "Crispy paneer pakora", image: "1721329323168food_1.png" },
        { name: "Mix Pakora Platter", price: 150, category: "Pure Veg", description: "Assorted pakora platter", image: "1721329323168food_1.png" }
    ]
};

const addMenus = async () => {
    try {
        for (const [stallName, items] of Object.entries(stallMenus)) {
            console.log(`\nAdding menu for ${stallName}...`);
            const response = await axios.post(`${url}/api/food/add-stall-menus`, {
                stallName,
                items
            });
            
            if (response.data.success) {
                console.log(`✅ ${response.data.message}`);
                console.log(`   Added items: ${response.data.addedItems.join(', ')}`);
            } else {
                console.log(`❌ Error: ${response.data.message}`);
            }
        }
        console.log("\n✅ All menus added successfully!");
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
};

addMenus();

