import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { publishHiringAd,getAll, getMyHiringAd, updateHireAd, enhanceDescription } from "../controllers/hireAd.controller";
import { validate } from "../middleware/validation";
import { hiringAdValidation } from "../middleware/validators/hireAd.validator";

const hireAdRouter = Router()

hireAdRouter.post("/publish",authenticate,hiringAdValidation,validate,publishHiringAd)
hireAdRouter.get("/getMyHiringAd",authenticate, getMyHiringAd)
hireAdRouter.get("/all",authenticate,getAll)
hireAdRouter.put("/updateAd",authenticate,hiringAdValidation,validate,updateHireAd)
hireAdRouter.post("/enhance-description",authenticate,enhanceDescription)

export default hireAdRouter