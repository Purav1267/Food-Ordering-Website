import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    stall:{type:String,required:false},
    averageRating:{type:Number,default:0},
    totalRatings:{type:Number,default:0},
    isPaused:{type:Boolean,default:false} // Pause item if ingredients not available
})

const foodModel = mongoose.models.food || mongoose.model("food",foodSchema)

export default foodModel;