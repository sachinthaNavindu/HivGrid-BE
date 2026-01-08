import { Request, Response } from "express";
import { User } from "../models/user.models";
import { sendEmail } from "../utils/emails";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-password -verificationCode")
      .lean();

    console.log(users);
    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const warn = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subject = "⚠️ Warning from HivGrid Admin";
    const html = `
      <h2>Account Warning</h2>
      <p>Hello <strong>${user.username}</strong>,</p>
      <p>This is an official warning from the HivGrid admin team.</p>
      <p>Please follow community guidelines.</p>
      <br/>
      <p>— HivGrid Admin</p>
    `;

    await sendEmail(user.email, subject, html);

    return res.status(200).json({
      message: "Warning email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
