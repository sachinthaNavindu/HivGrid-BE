import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { updatePost, deletePost } from "../controllers/post.controller";
import { validate } from "../middleware/validation";
import { publishPostValidation } from "../middleware/validators/post.validator";

const postRouter = Router()

postRouter.put("/updatePost",authenticate,publishPostValidation,validate,updatePost)
postRouter.post("/deletePost",authenticate,deletePost)

export default postRouter