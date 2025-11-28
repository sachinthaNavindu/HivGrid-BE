import { Router } from "express";
import { loadUserProfile, updateProfile,deleteAccount } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";

 const profileRouter = Router()

 profileRouter.get("/userProfile",authenticate,loadUserProfile)
 profileRouter.post("/updateProfile",authenticate,updateProfile)
 profileRouter.post("/deleteAccount",authenticate,deleteAccount)
 
 export default profileRouter

 