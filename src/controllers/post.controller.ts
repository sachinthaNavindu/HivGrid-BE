import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Post } from "../models/post.model";

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.user.sub;
    const { postId, title, caption, tags } = req.body;


    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postOwnerId =
      typeof post.user === "string" ? post.user : (post.user as any)._id.toString();

    if (postOwnerId !== userId) {
      return res.status(403).json({ message: "You are not allowed to update this post" });
    }

    if (title !== undefined) post.title = title;
    if (caption !== undefined) post.caption = caption;

    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    }

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
