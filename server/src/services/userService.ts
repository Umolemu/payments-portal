import bcrypt from "bcrypt";
import { UserModel, type IUser } from "../models/usermodel.js";
import type { ProtectedUser, UserDTO } from "../types/user.js";
import type { role } from "../types/role.js";
import { saltRounds } from "../constants/constants.js";
import { Types } from "mongoose";

// Convert DB user → safe user (no password)
const toPublic = (user: IUser): ProtectedUser => {
  const { _id, name, email, role, createdAt, updatedAt } = user;
  return { _id: Types.ObjectId, name, email, role, createdAt, updatedAt: updatedAt ?? createdAt };
};

// --- CRUD Operations ---

export async function getAllUsers(): Promise<ProtectedUser[]> {
  const users = await UserModel.find().select("-password");
  return users.map(toPublic);
}

export async function getUserByEmail(email: string): Promise<ProtectedUser | null> {
  const user = await UserModel.findOne({ email });
  return user ? toPublic(user) : null;
}

export async function createUser({
  name,
  email,
  password,
  role,
}: UserDTO): Promise<ProtectedUser> {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    role: role ?? "user",
  });

  const saved = await newUser.save();
  return toPublic(saved);
}

export async function verifyUserCredentials(
  email: string,
  plainPassword: string
): Promise<ProtectedUser | null> {
  const user = await UserModel.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(plainPassword, user.password);
  return match ? toPublic(user) : null;
}
