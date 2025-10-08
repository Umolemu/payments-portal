import { users, addUser, findUserByEmail } from "../db/usersDb.js";
import bcrypt from "bcryptjs";
import { saltRounds } from "../constants/constants.js";

// Strip sensitive fields
function toPublic(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export async function getAllUsers() {
  return users.map(toPublic);
}

export async function getUserByEmail(email) {
  return toPublic(findUserByEmail(email));
}

export async function createUser({ name, email, password, role }) {
  const existing = findUserByEmail(email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  const saved = addUser({ name, email, role, password: hashed });

  return toPublic(saved);
}

export async function verifyUserCredentials(email, plainPassword) {
  const raw = findUserByEmail(email);

  if (!raw) {
    return null;
  }

  const match = await bcrypt.compare(plainPassword, raw.password);
  return match ? toPublic(raw) : null;
}
