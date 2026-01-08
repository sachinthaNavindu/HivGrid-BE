import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getAllUsers, warn } from "../controllers/admin.controller";

const adminRouter = Router()

adminRouter.get("/getAllusers",authenticate,getAllUsers)
adminRouter.post("/warn",authenticate,warn)
export default adminRouter