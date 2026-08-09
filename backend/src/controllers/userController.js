import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const registerUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      message: "User registered successfully.",
      user: userData,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate email." });
    }
    console.error("Register error:", error);
    next(error);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        error: "All fields (email and password) are required.",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 401,
        error: "Invalid email or password.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        status: 401,
        error: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUserController = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { registerUserController, loginUserController, getCurrentUserController };
