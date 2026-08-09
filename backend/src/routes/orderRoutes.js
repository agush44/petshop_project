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
import { formLimiter } from "../middleware/rateLimiters.js";

const orderRoutes = Router();

orderRoutes.post("/", formLimiter, validate(orderSchema), createOrder);
orderRoutes.get("/", authToken, getOrders);
orderRoutes.get("/:id", authToken, getOrderById);
orderRoutes.patch(
  "/:id/status",
  authToken,
  requireAdmin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
// Sin authToken a propósito: el checkout admite compra como invitado, así
// que no siempre hay un usuario logueado disponible en este paso. El
// rate limit acota el abuso de tener que confiar en el _id como único control.
orderRoutes.patch("/:id/whatsapp-confirm", formLimiter, confirmOrderWhatsapp);

export { orderRoutes };
