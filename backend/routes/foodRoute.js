import express from "express";
import { addFood , listFood , removeFood, updateFood, togglePauseFood} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

//IMAGE STORAGE ENGINE

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);
foodRouter.put("/update",upload.single("image"),updateFood); // Image is optional for updates
foodRouter.post("/toggle-pause",togglePauseFood); // Pause/unpause food item

// New route to add stall menus in bulk
foodRouter.post("/add-stall-menus", async (req, res) => {
    try {
        const { stallName, items } = req.body;
        const foodModel = (await import("../models/foodModel.js")).default;
        
        const addedItems = [];
        const skippedItems = [];
        
        for (const item of items) {
            const existing = await foodModel.findOne({ 
                name: item.name, 
                stall: stallName 
            });
            
            if (!existing) {
                const food = new foodModel({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    stall: stallName,
                    image: item.image || "1721329323168food_1.png"
                });
                await food.save();
                addedItems.push(item.name);
            } else {
                skippedItems.push(item.name);
            }
        }
        
        res.json({ 
            success: true, 
            message: `Added ${addedItems.length} items for ${stallName}. ${skippedItems.length} items already existed.`,
            addedItems,
            skippedItems
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding menu items", error: error.message });
    }
});

export default foodRouter;
