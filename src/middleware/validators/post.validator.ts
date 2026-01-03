import { body } from "express-validator";

export const publishPostValidation = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("caption")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Caption must be at least 20 characters"),

  body("tags")
    .custom((value) => {
      if (!value) return true;

      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;

        if (!Array.isArray(parsed)) {
          throw new Error();
        }

        if (parsed.length > 10) {
          throw new Error("Maximum 10 tags allowed");
        }

        return true;
      } catch {
        throw new Error("Tags must be a valid array");
      }
    }),
];
