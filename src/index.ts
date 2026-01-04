import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRouter from "./routes/auth"
import homeRouter from "./routes/home"
import profileRouter from "./routes/profile"
import postRouter from "./routes/post"
import hireAdRouter from "./routes/hireAd"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: ["https://hiv-grid-fe.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

let isConnected = false

async function connectDB() {
  if (isConnected) return

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing")
  }

  await mongoose.connect(process.env.MONGO_URI)
  isConnected = true
  console.log("MongoDB connected")
}

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error("DB connection failed:", err)
    res.status(500).json({ message: "Database connection failed" })
  }
})


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})


app.use("/api/HivGrid/auth", authRouter)
app.use("/api/HivGrid/home", homeRouter)
app.use("/api/HivGrid/profile", profileRouter)
app.use("/api/HivGrid/post",postRouter)
app.use("/api/HivGrid/hire",hireAdRouter)




export default app