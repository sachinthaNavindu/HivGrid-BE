import mongoose, { Document, Schema } from "mongoose";

export enum Role {
  USER = "USER",
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string
  roles: Role[];
}

const userSchema = new Schema<IUSER>({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  username:{type:String,required:true},
  roles: {
    type:[String], 
    enum: Object.values(Role),
    default: [Role.USER] },
});

export const User = mongoose.model<IUSER>("User", userSchema);
