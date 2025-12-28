import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { generateImage } from "../controllers/imageGenerate.controller";


const imageRouter = Router()

imageRouter.post("/generate",generateImage)

export default imageRouter