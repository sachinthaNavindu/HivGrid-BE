import { Router } from "express";
import { registerUser,loginUser, forgetPassword, refreshToken,verify } from "../controllers/auth.controller";
import { registerValidation } from "../middleware/validators/auth.validator";
import { validate } from "../middleware/validation";


const authRouter = Router()

authRouter.post("/register",registerValidation,validate,registerUser)

authRouter.post("/login",loginUser)

authRouter.post("/resetPassword",forgetPassword)

authRouter.post("/refreshToken",refreshToken)

authRouter.post("/verify",verify)

export default authRouter