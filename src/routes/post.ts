import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { updatePost } from "../controllers/post.controller";

const postRouter = Router()

postRouter.put("/updatePost",authenticate,updatePost)

export default postRouter