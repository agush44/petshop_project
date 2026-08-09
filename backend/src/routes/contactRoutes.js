import { Router } from "express";
import { sendContactMessage, getContactMessages } from "../controllers/contactController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { contactSchema } from "../validations/contactValidation.js";

const contactRoutes = Router();

contactRoutes.post("/", validate(contactSchema), sendContactMessage);
contactRoutes.get("/", authToken, requireAdmin, getContactMessages);

export { contactRoutes };
