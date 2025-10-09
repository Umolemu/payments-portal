import { users, addUser, findUserByEmail } from "../db/usersDb.js";
import bcrypt from "bcrypt";
import { saltRounds } from "../constants/constants.js";
import type { ProtectedUser, User, UserDTO } from "../types/user.js";
import type { role } from "../types/role.js";

// Strip sensitive fields
// Non-null transformer for arrays and safe conversion for single values
const toPublicNonNull = (user: User): ProtectedUser => {
  const { password, ...rest } = user;
  return rest;
};

const toPublic = (user: User | null | undefined): ProtectedUser | null =>
  user ? toPublicNonNull(user) : null;

export async function getAllUsers(): Promise<ProtectedUser[]> {
  return users.map(toPublicNonNull);
}

export async function getUserByEmail(
  email: string
): Promise<ProtectedUser | null> {
  return toPublic(findUserByEmail(email));
}

export async function createUser({
  name,
  email,
  password,
  role,
}: UserDTO): Promise<ProtectedUser> {
  const existing = findUserByEmail(email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  const payload: {
    name: string;
    email: string;
    password: string;
    role?: role;
  } = {
    name,
    email,
    password: hashed,
  };
  if (role !== undefined) payload.role = role as role;
  const saved = addUser(payload);

  return toPublicNonNull(saved);
}

export async function verifyUserCredentials(
  email: string,
  plainPassword: string
): Promise<ProtectedUser | null> {
  const user = findUserByEmail(email);

  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(plainPassword, user.password);
  return match ? toPublic(user) : null;
}
