import { users, nextId } from "../db/usersDb.js";
import bcrypt from "bcryptjs";
import { saltRounds } from "../constants/constants.js";

export async function getAllUsers() {
  return Promise.resolve(users);
}

export async function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function createUser({ name, email, password }) {
  const existing = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashed = await bcrypt.hash(password, saltRounds);

  const user = {
    id: nextId++,
    name,
    email,
    password: hashed,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  // Return a copy without the password hash
  const { password: _omit, ...safeUser } = user;
  return safeUser;
}
