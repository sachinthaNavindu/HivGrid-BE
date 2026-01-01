import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { publishHiringAd,getAll } from "../controllers/hireAd.controller";

const hireAdRouter = Router()

hireAdRouter.post("/publish",authenticate,publishHiringAd)
hireAdRouter.get("/all",authenticate,getAll)

export default hireAdRouter