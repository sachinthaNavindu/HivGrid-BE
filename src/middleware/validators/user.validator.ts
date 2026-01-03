import { body } from "express-validator";

export const updateProfileValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .isAlpha("en-US")
    .withMessage("Username can only contain alphabet letters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address"),
];
