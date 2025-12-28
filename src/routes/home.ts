import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { loadData,loadUserData,publishPost } from "../controllers/home.controller";
import { upload } from "../middleware/upload";


const homeRouter = Router()

homeRouter.get("/loadData", loadData)

homeRouter.get("/loadUserData",authenticate,loadUserData)

homeRouter.post("/publish",authenticate,upload.single("image"),publishPost)



export default homeRouter