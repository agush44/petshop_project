import { Router } from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import validate from "../middleware/validate.js";
import { contactSchema } from "../validations/contactValidation.js";

const contactRoutes = Router();

contactRoutes.post("/", validate(contactSchema), sendContactMessage);

export { contactRoutes };
