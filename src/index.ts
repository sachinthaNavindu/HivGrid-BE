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

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: "https://hiv-grid-fe.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

async function connectDB() {
  if (mongoose.connection.readyState === 1) return

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing")
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log("MongoDB connected")
}

connectDB().catch(err => {
  console.error("MongoDB initial connection failed:", err)
})

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" })
})

app.use("/api/HivGrid/auth", authRouter)
app.use("/api/HivGrid/home", homeRouter)
app.use("/api/HivGrid/profile", profileRouter)
app.use("/api/HivGrid/post", postRouter)
app.use("/api/HivGrid/hire", hireAdRouter)

export default app
