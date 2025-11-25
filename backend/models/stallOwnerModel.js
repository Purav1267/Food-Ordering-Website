import mongoose from "mongoose";

const stallOwnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stallName: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

const stallOwnerModel = mongoose.models.stallOwner || mongoose.model("stallOwner", stallOwnerSchema);
export default stallOwnerModel;

