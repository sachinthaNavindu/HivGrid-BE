import { IUSER, Role, User } from "../models/user.models";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export const signAccessToken = (user: IUSER): string => {
  return jwt.sign(
    { sub: user._id.toString(), roles: user.roles },
    ACCESS_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

export const signRefreshToken = (user: IUSER): string => {
  return jwt.sign(
    {
      sub: user._id.toString()
        },
    REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
