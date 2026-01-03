import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { loadData,loadUserData,publishPost } from "../controllers/home.controller";
import { upload } from "../middleware/upload";
import { publishPostValidation } from "../middleware/validators/post.validator";
import { validate } from "../middleware/validation";


const homeRouter = Router()

homeRouter.get("/loadData", loadData)

homeRouter.get("/loadUserData",authenticate,loadUserData)

homeRouter.post("/publish",authenticate,upload.single("image"),publishPostValidation,validate,publishPost)



export default homeRouter