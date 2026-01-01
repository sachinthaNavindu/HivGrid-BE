import mongoose, { Document, Schema } from "mongoose";

export interface IHiringAd extends Document {
  description: string;
  selectedSkills: string[];
  whatsApp?: string;
  email: string;
  username: string;
  user: mongoose.Types.ObjectId;
}

const HiringAdSchema = new Schema<IHiringAd>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    selectedSkills: [
      {
        type: String,
        required: true,
      },
    ],

    whatsApp: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HiringAd = mongoose.model<IHiringAd>(
  "HiringAd",
  HiringAdSchema
);
