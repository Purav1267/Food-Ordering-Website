import feedbackModel from "../models/feedbackModel.js";
import foodModel from "../models/foodModel.js";

// Calculate and update ratings for all food items
const updateAllRatings = async () => {
    try {
        const allFoods = await foodModel.find({});
        
        for (const food of allFoods) {
            const feedbacks = await feedbackModel.find({ itemId: food._id.toString() });
            
            if (feedbacks.length > 0) {
                const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
                const averageRating = totalRating / feedbacks.length;
                
                await foodModel.findByIdAndUpdate(food._id, {
                    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                    totalRatings: feedbacks.length
                });
            } else {
                await foodModel.findByIdAndUpdate(food._id, {
                    averageRating: 0,
                    totalRatings: 0
                });
            }
        }
        
        return { success: true, message: "Ratings updated" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Error updating ratings" };
    }
};

// Update rating for a specific item
const updateItemRating = async (itemId) => {
    try {
        const feedbacks = await feedbackModel.find({ itemId });
        
        if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
            const averageRating = totalRating / feedbacks.length;
            
            await foodModel.findByIdAndUpdate(itemId, {
                averageRating: Math.round(averageRating * 10) / 10,
                totalRatings: feedbacks.length
            });
        } else {
            await foodModel.findByIdAndUpdate(itemId, {
                averageRating: 0,
                totalRatings: 0
            });
        }
        
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
};

export { updateAllRatings, updateItemRating };

