import { Router } from "express";
import { loadUserProfile, updateProfile,deleteAccount } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

 const profileRouter = Router()


 profileRouter.get("/userProfile",authenticate,loadUserProfile)

 profileRouter.post("/updateProfile",authenticate,upload.single("image"),updateProfile)

 profileRouter.post("/deleteAccount",authenticate,deleteAccount)
 
 export default profileRouter

 