import { Router } from "express";
import {
  getUsersController,
  getUserController,
  createUserController,
} from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", getUsersController);
userRoutes.get("/:email", getUserController);
userRoutes.post("/", createUserController);

export default userRoutes;
