import { AuthRequest } from "../middleware/auth";
import { Response } from "express";
import { v2 as cloudinary } from "cloudinary"
import {  User } from "../models/user.models"
import { Post } from "../models/post.model";



export const loadUserProfile = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.user.sub

    if(!userId){
      return res.status(401).json({message:"Unauthorized Request"})
    }

    const user = await User.findById(userId).select("-password")

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    const postCount = await Post.countDocuments({user:userId})

        const posts = await Post.find({ user: userId })
                            .sort({ createdAt: -1 })
                            .populate('user', 'username email imageUrl');

    return res.status(200).json({message:"User profile loaded succefully",
      user,
      postCount,
      posts
    })

  }catch(err){
    return res.status(500).json({message:"Internal server Error...!"})
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.body;
    const userId = req.user.sub;     
    const fileBuffer = req.file?.buffer;

    if (!username && !fileBuffer) {
      return res.status(400).json({
        message: "Nothing to update. Provide username or profile picture.",
      });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let uploadedImageUrl = existingUser.imageUrl;

    if (fileBuffer) {
      const uploadedImage: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(fileBuffer);
      });

      uploadedImageUrl = uploadedImage.secure_url;
    }

    existingUser.username = username || existingUser.username;
    existingUser.imageUrl = uploadedImageUrl;

    await existingUser.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: existingUser,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error"
  });
  }
};


export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try{
      const userId = req.user.sub
      
      if(!userId){
        return res.status(401).json({ message: "Unauthorized Request" })
      }
      const user = await User.findById(userId);
     
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if(user.imageUrl){
        const segments = user.imageUrl.split("/")
        const fileName = segments[segments.length - 1]
        const publicId = "profiles/"+fileName.split(".")[0]

        try{
          await cloudinary.uploader.destroy(publicId)
        }catch(err){
          return res.status(401).json({message:"Cloudinary delete failed",err})
        }
      }

      await User.findByIdAndDelete(userId)

      return res.status(200).json({message:"Account deleted Succefully"})
    }catch(err){
      return res.status(500).json({message:"Internal server Error"})
    }
};
