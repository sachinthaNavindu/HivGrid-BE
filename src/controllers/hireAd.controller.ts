import { Request, Response } from "express";
import { HiringAd } from "../models/hireAd.model";
import { AuthRequest } from "../middleware/auth";

export const publishHiringAd = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub 


    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      name,
      userEmail,
      description,
      selectedSkills,
      countryCode,
      phoneNumber,
    } = req.body;


    if (!description || !countryCode) {
      return res.status(400).json({
        message: "Description and country code are required",
      });
    }

    if (phoneNumber && !/^\d{8,15}$/.test(phoneNumber)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    const whatsApp =
      phoneNumber ? `${countryCode}${phoneNumber}` : undefined;

    const hiringAd = await HiringAd.create({
      username:name,
      email:userEmail,
      description,
      selectedSkills,
      whatsApp,
      user: userId,
    });

    return res.status(201).json({
      message: "Hiring ad published successfully",
      hiringAd,
    });
  } catch (error) {
    console.error("Publish hiring ad error:", error);
    return res.status(500).json({
      message: "Failed to publish hiring ad",
    });
  }
};


export const getAll = async (req: Request, res: Response) => {
  try {
    const hiringAds = await HiringAd.find()
      .sort({ createdAt: -1 }) 
      .populate("user", "username email imageUrl") 
      .lean();

    return res.status(200).json({
      message: "Hiring ads fetched successfully",
      data: hiringAds,
    });
  } catch (error) {
    console.error("Get all hiring ads error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
