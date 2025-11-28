import { Router } from "express";
import { registerUser,loginUser, forgetPassword, refreshToken } from "../controllers/auth.controller";


const authRouter = Router()

authRouter.post("/register",registerUser)

authRouter.post("/login",loginUser)

authRouter.post("/forgottPassword",forgetPassword)

authRouter.post("/refreshToken",refreshToken)

export default authRouter