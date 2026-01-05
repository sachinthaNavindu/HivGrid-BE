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
const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: "https://hiv-grid-fe.vercel.app",
    // origin:"http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)



app.get("/api/health", (_, res) => {
  res.json({ status: "ok" })
})

app.use("/api/HivGrid/auth", authRouter)
app.use("/api/HivGrid/home", homeRouter)
app.use("/api/HivGrid/profile", profileRouter)
app.use("/api/HivGrid/post", postRouter)
app.use("/api/HivGrid/hire", hireAdRouter)


mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("DB is Connected")
    })
    .catch((err) => {
        console.log("DB isn't connected :", err)
        process.exit(1)
    })

app.listen(PORT, () => {
    console.log("Server is connected  ",PORT)
})


export default app
