import express from "express";
import { getAllUsers, getAllStalls, deleteUser, deleteStall } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Admin routes (Note: In production, add admin authentication middleware)
adminRouter.get("/users", getAllUsers);
adminRouter.get("/stalls", getAllStalls);
adminRouter.post("/users/delete", deleteUser);
adminRouter.post("/stalls/delete", deleteStall);

export default adminRouter;

