import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getUsersController,
  getUserController,
  createUserController,
  loginController,
  logoutController,
} from "../controllers/userController.js";

import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  registerUserValidators,
  loginValidators,
} from "../validations/userValidations.js";

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
  ...registerUserValidators,
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
  ...loginValidators,
  validateRequest,
  loginController
);

// Logout
userRoutes.post("/logout", logoutController);

export default userRoutes;
