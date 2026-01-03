import { Request, response, Response } from "express";
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
  } catch (error:any) {
    if(error.code === 11000){
      return res.status(409).json({message:"You already have a published hiring ad"})
    }
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyHiringAd = async(req:AuthRequest, res:Response)=> {
  try{
    const userId = req.user.sub

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myHiringAd = await HiringAd.findOne({ user: userId })
      .populate("user", "username email imageUrl")
      .lean();

    if (!myHiringAd) {
      return res.status(404).json({
        message: "No hiring ad found for this user",
      });
    }

    return res.status(200).json({
      data: myHiringAd
    })
  }catch(error){
    return res.status(500).json({
      message:"Internal server error"
    })
  }
}

export const updateHireAd = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub;

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

    const updatedAd = await HiringAd.findOneAndUpdate(
      { user: userId }, 
      {
        username: name,
        email: userEmail,
        description,
        selectedSkills,
        whatsApp,
      },
      {
        new: true,       
        runValidators: true,
      }
    )
      .populate("user", "username email imageUrl")
      .lean();

    if (!updatedAd) {
      return res.status(404).json({
        message: "Hiring ad not found",
      });
    }

    return res.status(200).json({
      message: "Hiring ad updated successfully",
      data: updatedAd,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update hiring ad",
    });
  }
};
