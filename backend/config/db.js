import mongoose, { mongo } from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://puravmalik24:v6TXzCc8YW5lMqxv@cluster0.ubhyssy.mongodb.net/Tomato').then(()=>console.log("DB Connected"));
}