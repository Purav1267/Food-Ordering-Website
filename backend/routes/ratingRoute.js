import express from "express";
import { updateAllRatings } from "../controllers/ratingController.js";

const ratingRouter = express.Router();

ratingRouter.post("/update-all", async (req, res) => {
    const result = await updateAllRatings();
    res.json(result);
});

export default ratingRouter;

