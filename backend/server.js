import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import stallOwnerRouter from "./routes/stallOwnerRoute.js"
import stallOrderRouter from "./routes/stallOrderRoute.js"
import feedbackRouter from "./routes/feedbackRoute.js"
import ratingRouter from "./routes/ratingRoute.js"
import adminRouter from "./routes/adminRoute.js"

//APP CONFIG

const app = express()
const port = process.env.PORT || 4000

//MIDDLEWARE

app.use(express.json())
app.use(cors())

// DB CONNECTION
connectDB();

//API ENDPOINT ROUTES 
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/stall-owner",stallOwnerRouter)
app.use("/api/stall",stallOrderRouter)
app.use("/api/feedback",feedbackRouter)
app.use("/api/rating",ratingRouter)
app.use("/api/admin",adminRouter)
app.use("/feedback-images",express.static('uploads/feedback'))

app.get("/",(req,res)=>{
    res.send("API Working")
})

// +++ ADDED HEALTH ENDPOINT +++
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" })
})
// ++++++++++++++++++++++++++++++

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})