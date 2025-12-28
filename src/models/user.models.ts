import mongoose, { Document, Schema } from "mongoose";

export enum Role {
  USER = "USER",
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  imageUrl: string;
  roles: Role[];
  verificationCode?: string;
  isVerified: boolean;
}


const userSchema = new Schema<IUSER>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  imageUrl: { type: String },
  roles: {
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false }
});


export const User = mongoose.model<IUSER>("User", userSchema);
