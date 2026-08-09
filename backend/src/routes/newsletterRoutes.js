import { Router } from "express";
import { subscribeNewsletter } from "../controllers/newsletterController.js";
import validate from "../middleware/validate.js";
import { newsletterSchema } from "../validations/newsletterValidation.js";

const newsletterRoutes = Router();

newsletterRoutes.post("/", validate(newsletterSchema), subscribeNewsletter);

export { newsletterRoutes };
