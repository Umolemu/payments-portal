import dotenv from "dotenv";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  verifyUserCredentials,
} from "../services/userService.js";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { Request, Response } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
};
const ACCESS_TOKEN_EXPIRES_IN: Exclude<SignOptions["expiresIn"], undefined> =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as Exclude<
    SignOptions["expiresIn"],
    undefined
  >) ?? "15m";

//User Controllers
export async function getUsersController(req: Request, res: Response) {
  try {
    const list = await getAllUsers();
    res.json(list);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserController(req: Request, res: Response) {
  try {
    const { email } = req.params as { email?: string };
    if (!email)
      return res.status(400).json({ error: "email param is required" });
    const user = await getUserByEmail(String(email));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUserController(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    const user = await createUser({ name, email, password, role });
    res.status(201).json(user);
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("exists")) {
      return res.status(409).json({ error: message });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
}

//Login Controller
export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = await verifyUserCredentials(email, password);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    // Generate JWT payload (avoid sensitive info)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role || "user",
    };

    // Sign the token
    const signOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET as string, signOptions);

    // Set the token in an httpOnly, secure cookie (protects against XSS)
    // Use __Host- prefix for strongest cookie scoping (requires Secure, Path=/, no Domain)
    res.cookie("__Host-accessToken", token, {
      httpOnly: true,
      secure: true, // must use HTTPS
      sameSite: "lax", // or 'strict' if your flows allow
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Respond with success (ProtectedUser already excludes password)
    const safeUser = user;
    res.json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify user" });
  }
}

//Logout Controller
export async function logoutController(req: Request, res: Response) {
  try {
    // Clear the access token cookie
    res.clearCookie("__Host-accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    res.json({ message: "Logout successful" });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to logout" });
  }
}
