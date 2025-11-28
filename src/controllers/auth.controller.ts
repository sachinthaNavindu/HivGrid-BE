import { Request, Response } from "express"
import { IUSER, Role, User } from "../models/user.models"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/tokens";

dotenv.config()

const JWT_ACCESS_SECRET = process.env.JWT_SECRET as string

export const registerUser = async (req: Request, res: Response) => {
    try{
        const { email, password, username } = req.body

        if(!email || !password || !username){
            return res.status(401).json({message:"Missing required fields. Ensure email, username, and password are included."})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "Email already exists"})
        }

        const hash = await bcrypt.hash(password,10)

        const user = await User.create({
            email,
            username,
            password:hash
        })

        res.status(201).json({
            message :"Usern Registered Succefully",
            data: { email:user.email,
                    username:user.username
            }
        })
    }catch(err){
        res.status(500).json({
            message :"Internal server Error"
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body

        const existingUser = (await User.findOne({email})) as IUSER | null
        
        if(!existingUser){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const valid = await bcrypt.compare(password,existingUser.password)

        if(!valid){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const accessToken = signAccessToken(existingUser)
        const refereshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message : "Login successful",
            data:{
                email:existingUser.email,
                accessToken,
                refereshToken
            }
        })

    }catch(err){
        res.status(500).json({
            message : "Internal server Error"
        })
    }
}

export const forgetPassword = async (req: Request, res: Response) => {
    try{
        const {email,newPassword} = req.body

        const existingUser = (await User.findOne({email})) as IUSER | null

        if(!existingUser){
            return res.status(401).json({message:"User not found for the provided email"})
        }

        const hash = await bcrypt.hash(newPassword,10)

        existingUser.password = hash

        await existingUser.save()

        res.status(200).json({
            message:"Password reset completed successfully"
        })

    }catch(err){
        res.status(500).json({
        message : "Internal server Error"
        })      
    }

}

export const refreshToken = async (req: Request, res: Response) => {
    try{
        const { token } = req.body

        if(!token){
            return res.status(400).json({
                message: "Refresh token is missing or invalid"
            })
        }

        const payload = jwt.verify(token,JWT_ACCESS_SECRET)

        const user = await User.findById(payload.sub)

        if(!user){
            return res.status(403).json({
                message:"User NOT FOUND or No User logged in"
            })
        }

        const accessToken = signAccessToken(user)

        res.status(200).json({
            accessToken
        })

    }catch(err){
        res.status(403).json({message:"Invaid or Expired Token"})
    }
}