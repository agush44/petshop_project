import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  confirmOrderWhatsapp,
} from "../controllers/orderController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { orderSchema, updateOrderStatusSchema } from "../validations/orderValidation.js";

const orderRoutes = Router();

orderRoutes.post("/", validate(orderSchema), createOrder);
orderRoutes.get("/", authToken, getOrders);
orderRoutes.get("/:id", authToken, getOrderById);
orderRoutes.patch(
  "/:id/status",
  authToken,
  requireAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
orderRoutes.patch("/:id/whatsapp-confirm", confirmOrderWhatsapp);

export { orderRoutes };
