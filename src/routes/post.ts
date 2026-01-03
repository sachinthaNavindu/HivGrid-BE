import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { updatePost } from "../controllers/post.controller";
import { validate } from "../middleware/validation";
import { publishPostValidation } from "../middleware/validators/post.validator";

const postRouter = Router()

postRouter.put("/updatePost",authenticate,publishPostValidation,validate,updatePost)

export default postRouter