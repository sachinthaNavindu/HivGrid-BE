import mongoose, { Document, Schema} from "mongoose";

export interface IPost extends Document{
    title: string
    caption: string
    imageUrl: string
    tags: string[]
    user: mongoose.Types.ObjectId
}

const PostSchema = new Schema<IPost>(
    {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {timestamps:true}
)

export const Post = mongoose.model<IPost>("Post", PostSchema);
