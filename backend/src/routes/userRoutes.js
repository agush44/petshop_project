import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  getCurrentUserController,
} from "../controllers/userController.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/userValidation.js";
import validate from "../middleware/validate.js";
import { authToken } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const userRoutes = Router();

userRoutes.post(
  "/register",
  authLimiter,
  validate(registerUserSchema),
  registerUserController
);
userRoutes.post("/login", authLimiter, validate(loginUserSchema), loginUserController);
userRoutes.get("/me", authToken, getCurrentUserController);

export { userRoutes };
