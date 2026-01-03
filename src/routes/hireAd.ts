import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { publishHiringAd,getAll, getMyHiringAd, updateHireAd } from "../controllers/hireAd.controller";

const hireAdRouter = Router()

hireAdRouter.post("/publish",authenticate,publishHiringAd)
hireAdRouter.get("/getMyHiringAd",authenticate, getMyHiringAd)
hireAdRouter.get("/all",authenticate,getAll)
hireAdRouter.put("/updateAd",authenticate,updateHireAd)

export default hireAdRouter