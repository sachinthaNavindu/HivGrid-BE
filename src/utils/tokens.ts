import { IUSER, Role, User} from "../models/user.models"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string 

export const signAccessToken = (user: IUSER): string => {
    return jwt.sign({sub: user._id.toString(),roles: user.roles }, JWT_SECRET,{
        expiresIn: "30m",
    })
}

export const signRefreshToken = (user:IUSER):string => {
    return jwt.sign(
        {
            sub: user._id.toString()
        },
            JWT_SECRET,
        {
            expiresIn : "7d",
        }
    )
}
