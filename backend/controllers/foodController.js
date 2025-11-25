import foodModel from "../models/foodModel.js";
import fs from 'fs';

//ADD FOOD ITEM

const addFood = async (req,res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
        stall:req.body.stall || ""
    })

    try{
        await food.save();
        res.json({success:true,message:"Food Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error-Food Not Added"})
    }

}

//ALL FOOD LIST
const listFood = async (req,res)=>{
    try {
        const { stall } = req.query;
        let query = {};
        if (stall) {
            query.stall = stall;
        }
        const foods = await foodModel.find(query);
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food item
const removeFood = async (req,res)=>{
    try {
        const food = await  foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//update food item
const updateFood = async (req,res)=>{
    try {
        const { id, name, description, price, category, stall } = req.body;
        const food = await foodModel.findById(id);
        
        if (!food) {
            return res.json({success:false,message:"Food item not found"});
        }

        // Update fields
        if (name !== undefined) food.name = name;
        if (description !== undefined) food.description = description;
        if (price !== undefined) food.price = parseFloat(price);
        if (category !== undefined) food.category = category;
        if (stall !== undefined) food.stall = stall;

        // Handle image update if new image is provided
        if (req.file) {
            // Delete old image if it exists
            try {
                if (food.image && fs.existsSync(`uploads/${food.image}`)) {
                    fs.unlink(`uploads/${food.image}`,()=>{});
                }
            } catch (err) {
                console.log("Error deleting old image:", err);
            }
            food.image = req.file.filename;
        }

        await food.save();
        res.json({success:true,message:"Food Updated", data: food});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error updating food item"})
    }
}


// Pause or unpause food item
const togglePauseFood = async (req, res) => {
    try {
        const { id, isPaused } = req.body;
        const food = await foodModel.findById(id);
        
        if (!food) {
            return res.json({success: false, message: "Food item not found"});
        }

        // Update isPaused status
        food.isPaused = isPaused === true || isPaused === "true";
        await food.save();
        
        res.json({
            success: true,
            message: food.isPaused ? "Food item paused" : "Food item unpaused",
            data: food
        });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error updating food item pause status"});
    }
}

export {addFood,listFood,removeFood,updateFood,togglePauseFood}