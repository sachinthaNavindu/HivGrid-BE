import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateImage = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const result = await model.generateContent(text);
    const response = result.response;

    let imageGenerated = false;

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync("generated-image.png", buffer);
        imageGenerated = true;
      }
    }

    if (!imageGenerated) {
      return res.status(200).json({
        message: "No image returned by model",
        text: response.text(),
      });
    }

    return res.status(200).json({
      message: "Image generated successfully",
      file: "generated-image.png",
    });

  } catch (err: any) {
    console.error(err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "Gemini quota exceeded. Enable billing or wait.",
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message || err,
    });
  }
};
