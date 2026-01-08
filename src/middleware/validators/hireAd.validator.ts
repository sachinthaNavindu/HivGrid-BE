import { body } from "express-validator";

export const hiringAdValidation = [
  body("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("selectedSkills")
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Skills must be an array");
      }
      if (value.length === 0) {
        throw new Error("At least one skill is required");
      }
      if (value.length > 15) {
        throw new Error("Maximum 15 skills allowed");
      }
      return true;
    }),

  body("userEmail")
    .isEmail()
    .withMessage("Invalid email address"),

  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
];
