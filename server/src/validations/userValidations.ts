import { body } from "express-validator";
import { NAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from "./patterns.js";

export const registerUserValidators = [
  body("name")
    .isString()
    .trim()
    .matches(NAME_REGEX)
    .withMessage("Invalid name format")
    .isLength({ min: 2, max: 50 }),
  body("email")
    .isString()
    .trim()
    .matches(EMAIL_REGEX)
    .withMessage("Invalid email format"),
  body("password")
    .isString()
    .matches(PASSWORD_REGEX)
    .withMessage("Invalid password format"),
  body("role").optional().isString(),
];

export const loginValidators = [
  body("email")
    .isString()
    .trim()
    .matches(EMAIL_REGEX)
    .withMessage("Invalid email format"),
  body("password")
    .isString()
    .matches(PASSWORD_REGEX)
    .withMessage("Invalid password format"),
];
