import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

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