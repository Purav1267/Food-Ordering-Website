import express from "express";
import { registerStallOwner, loginStallOwner, getStallOwnerInfo, updateStallOwner } from "../controllers/stallOwnerController.js";
import stallOwnerAuth from "../middleware/stallOwnerAuth.js";

const stallOwnerRouter = express.Router();

stallOwnerRouter.post("/register", registerStallOwner);
stallOwnerRouter.post("/login", loginStallOwner);
stallOwnerRouter.get("/info", stallOwnerAuth, getStallOwnerInfo);
stallOwnerRouter.put("/update", stallOwnerAuth, updateStallOwner);

export default stallOwnerRouter;

