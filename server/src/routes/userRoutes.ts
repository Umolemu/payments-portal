import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getUsersController,
  getUserController,
  createUserController,
  loginController,
} from "../controllers/userController.js";

import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validateRequest.js";

const userRoutes = Router();

userRoutes.get("/", getUsersController);

// validate that :email is a valid email
userRoutes.get(
  "/:email",
  param("email").isEmail().withMessage("Invalid email"),
  validateRequest,
  getUserController
);

userRoutes.post(
  "/",
  body("name").isString().trim().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("role").optional().isString(),
  validateRequest,
  createUserController
);

// Login / credential verification
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
userRoutes.post(
  "/login",
  loginLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  validateRequest,
  loginController
);

export default userRoutes;
