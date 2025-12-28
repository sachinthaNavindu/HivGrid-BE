import { Request, Response } from "express"
import { IPost, Post } from "../models/post.model"
import { AuthRequest } from "../middleware/auth"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import { User } from "../models/user.models"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

export const loadData = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate("user", "email username imageUrl")
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)

      console.log(posts)

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      data: posts,
    });

  } catch (err) {}
}

export const loadUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.sub
    
    if(!userId){
      return res.status(400).json({message:"Invalid token"})
    }
    const user = await User.findById(userId).select("-password")

    if(!user){
      return res.status(400).json({message:"User not found"})
    }

    
    res.status(200).json({
      message:"User data loaded successfully",
      user
    })
  } catch (err) {
    res.status(500).json({message:"Internal server error"})
  }
}

export const publishPost = async (req: AuthRequest, res: Response) => {
  try {
    const {title,caption,tags} = req.body;
    const user = req.user.sub;
    const image = req.file?.buffer;

    if (!title || !caption || !tags || !image) {
      return res
        .status(400)
        .json({
          message:
            "Required fields are missing. Ensure all fields are filled before submitting..!",
        })
    }

    await cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Image upload failed",error })
        }
        const post = await Post.create({
          user,
          title,
          caption,
          tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
          imageUrl: result?.secure_url,
        } as IPost)
        return res
          .status(201)
          .json({ message: "Post published successfully..!",data:post });
      })
      .end(image)
  } catch (err) {
    res.status(500).json({ message: "Internal server error" })
  }
}
