import { Router } from "express";
import { registerUser,loginUser, forgetPassword, refreshToken,verify } from "../controllers/auth.controller";


const authRouter = Router()

authRouter.post("/register",registerUser)

authRouter.post("/login",loginUser)

authRouter.post("/forgottPassword",forgetPassword)

authRouter.post("/refreshToken",refreshToken)

authRouter.post("/verify",verify)

export default authRouter