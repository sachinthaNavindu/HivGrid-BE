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
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Authorization"]
  })
);


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});

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


export default app