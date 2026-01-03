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

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173","https://hiv-grid-fe.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    credentials: true,
  })
);

app.use(express.json())

app.use("/api/HivGrid/auth", authRouter)
app.use("/api/HivGrid/home", homeRouter)
app.use("/api/HivGrid/profile", profileRouter)
app.use("/api/HivGrid/post",postRouter)
app.use("/api/HivGrid/hire",hireAdRouter)

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

app.listen(PORT, () => {
  console.log("Server is running", PORT)
})
