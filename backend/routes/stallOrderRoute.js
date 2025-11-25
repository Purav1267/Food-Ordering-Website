import express from "express";
import { getStallOrders, updateStallOrderStatus } from "../controllers/stallOrderController.js";
import stallOwnerAuth from "../middleware/stallOwnerAuth.js";

const stallOrderRouter = express.Router();

stallOrderRouter.get("/orders", stallOwnerAuth, getStallOrders);
stallOrderRouter.post("/update-status", stallOwnerAuth, updateStallOrderStatus);

export default stallOrderRouter;

