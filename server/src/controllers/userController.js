import jwt from "jsonwebtoken";
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  verifyUserCredentials,
} from "../services/userService.js";

const JWT_SECRET = process.env.JWT_SECRET || "replace-with-env-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

//User Controllers
export async function getUsersController(req, res) {
  try {
    const list = await getAllUsers();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserController(req, res) {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUserController(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    const user = await createUser({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    if (error.message.includes("exists")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
}

//Login Controller
export async function loginController(req, res) {
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
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // Set the token in an httpOnly, secure cookie (protects against XSS)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true, // must use HTTPS
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Respond with success (user details but not password)
    const { password: _, ...safeUser } = user;
    res.json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify user" });
  }
}
