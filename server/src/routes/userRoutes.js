import { Router } from "express";
import {
  getUsersController,
  getUserController,
  createUserController,
  loginController,
} from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", getUsersController);
userRoutes.get("/:email", getUserController);
userRoutes.post("/", createUserController);

// Login / credential verification
userRoutes.post("/login", loginController);

export default userRoutes;
