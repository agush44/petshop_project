import { Router } from "express";
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
} from "../controllers/newsletterController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { newsletterSchema } from "../validations/newsletterValidation.js";

const newsletterRoutes = Router();

newsletterRoutes.post("/", validate(newsletterSchema), subscribeNewsletter);
newsletterRoutes.get("/", authToken, requireAdmin, getNewsletterSubscribers);

export { newsletterRoutes };
