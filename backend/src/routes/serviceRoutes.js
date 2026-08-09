import { Router } from "express";
import {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { serviceSchema } from "../validations/serviceValidation.js";

const serviceRoutes = Router();

serviceRoutes.get("/", getServices);
serviceRoutes.get("/admin", authToken, requireAdmin, getAllServicesAdmin);
serviceRoutes.post("/", authToken, requireAdmin, validate(serviceSchema), createService);
serviceRoutes.put("/:id", authToken, requireAdmin, validate(serviceSchema), updateService);
serviceRoutes.delete("/:id", authToken, requireAdmin, deleteService);

export { serviceRoutes };
