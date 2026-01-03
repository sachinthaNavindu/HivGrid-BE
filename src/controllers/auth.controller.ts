import { Request, Response } from "express";
import { IUSER, User } from "../models/user.models";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/tokens";
import { sendEmail } from "../utils/emails";
import verificationCodes from "../store/verificationCodes";

dotenv.config();

const JWT_SECRET  = process.env.JWT_SECRET as string;

//2.5
export const verify = async (req: Request, res: Response) => {
  const {email} = req.body
  
    const code = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  verificationCodes[email] = code;
  try {
    await sendEmail(
      email,
      "Verify Your Account",
      `<p>Your verification code is:</p>
         <h2>${code}</h2>`
    );

    return res.status(200).json({message:"Email sent succefully"})
  } catch (error) {
    return res.status(400).json({
      message: "Failed to send verification email. The email may be invalid.",
    })
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password,code } = req.body

    if (!email || !username || !password || !code) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields. Please provide email, code,userName, and password",
        })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ message: "Email already Exists" })
    }

    if (verificationCodes[email] !== code) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    delete verificationCodes[email]

    const hashed = await bcrypt.hash(password, 10)

    await User.create({ email, username, password: hashed })
    
    return res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    const existingUser = (await User.findOne({ email })) as IUSER | null;

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const valid = await bcrypt.compare(password, existingUser.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const accessToken = signAccessToken(existingUser);
    const refreshToken = signRefreshToken(existingUser);

    res.status(200).json({
      message: "Login successful",
      data: {
        email: existingUser.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const existingUser = (await User.findOne({ email })) as IUSER | null;

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "User not found for the provided email" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    existingUser.password = hash;

    await existingUser.save();

    res.status(200).json({
      message: "Password reset completed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken  } = req.body;

    if (!refreshToken ) {
      return res.status(400).json({
        message: "Refresh token is missing or invalid",
      });
    }

    const payload = jwt.verify(refreshToken , JWT_SECRET )

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(403).json({
        message: "User NOT FOUND or No User logged in",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken2 = signRefreshToken(user);

    res.status(200).json({
      accessToken,
      refreshToken:refreshToken2
    });
  } catch (err) {
    res.status(403).json({ message: "Invaid or Expired Token" })
  }
};
