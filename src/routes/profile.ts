import { Router } from "express";
import { loadUserProfile, updateProfile,deleteAccount } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { updateProfileValidation } from "../middleware/validators/user.validator";
import { validate } from "../middleware/validation";

 const profileRouter = Router()


 profileRouter.get("/userProfile",authenticate,loadUserProfile)

 profileRouter.post("/updateProfile",authenticate,upload.single("image"),updateProfileValidation,validate,updateProfile)

 profileRouter.post("/deleteAccount",authenticate,deleteAccount)
 
 export default profileRouter

 