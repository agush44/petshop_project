import { Router } from "express";
import { getPaymentConfig, getPaymentStatus, mercadoPagoWebhook } from "../controllers/paymentController.js";
import { confirmBankTransfer } from "../controllers/orderController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";

const paymentRoutes = Router();

paymentRoutes.get("/config", getPaymentConfig);
paymentRoutes.get("/orders/:orderId/status", getPaymentStatus);
paymentRoutes.post("/webhook", mercadoPagoWebhook);
paymentRoutes.patch("/orders/:orderId/transfer/confirm", authToken, requireAdmin, (req, res, next) => {
  req.params.id = req.params.orderId;
  next();
}, confirmBankTransfer);

export { paymentRoutes };
