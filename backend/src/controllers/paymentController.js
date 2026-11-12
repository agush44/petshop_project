import { createHmac, timingSafeEqual } from "node:crypto";
import Order from "../models/order.js";

const getPaymentConfig = (_req, res) => {
  res.json({
    mercadoPagoAvailable: Boolean(process.env.MP_ACCESS_TOKEN && process.env.MP_WEBHOOK_SECRET),
    transfer: {
      bankName: process.env.TRANSFER_BANK_NAME || "",
      accountHolder: process.env.TRANSFER_ACCOUNT_HOLDER || "",
      taxId: process.env.TRANSFER_TAX_ID || "",
      cbu: process.env.TRANSFER_CBU || "",
      alias: process.env.TRANSFER_ALIAS || "",
      accountType: process.env.TRANSFER_ACCOUNT_TYPE || "",
    },
  });
};

const getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select("payment.method payment.status status");
    if (!order) return res.status(404).json({ message: "Pedido no encontrado." });
    res.json({
      paymentMethod: order.payment?.method || "whatsapp",
      paymentStatus: order.payment?.status || "not_required",
      orderStatus: order.status,
    });
  } catch {
    res.status(400).json({ message: "Identificador de pedido inválido." });
  }
};

const verifyWebhookSignature = (signatureHeader, requestId, dataId, secret) => {
  if (!signatureHeader || !requestId || !dataId || !secret) return false;
  const signatureParts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const separator = part.indexOf("=");
      return separator === -1 ? ["", ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
    })
  );
  const ts = signatureParts.ts;
  const suppliedHash = signatureParts.v1;
  if (!ts || !suppliedHash || !/^[a-f0-9]{64}$/i.test(suppliedHash)) return false;
  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest();
  const actualHash = Buffer.from(suppliedHash, "hex");
  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
};

const mercadoPagoWebhook = async (req, res) => {
  const dataId = req.query["data.id"] || req.body?.data?.id;
  const eventType = req.query.type || req.body?.type;
  if (eventType !== "payment" || !dataId) return res.sendStatus(200);

  if (!process.env.MP_WEBHOOK_SECRET) {
    console.error("MP_WEBHOOK_SECRET is missing; payment notification was not processed");
    return res.sendStatus(503);
  }

  const validSignature = verifyWebhookSignature(
    req.get("x-signature"),
    req.get("x-request-id"),
    dataId,
    process.env.MP_WEBHOOK_SECRET
  );
  if (!validSignature) return res.sendStatus(401);

  try {
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    // The dashboard's webhook URL simulator can send a synthetic ID (for
    // example, 123456) that does not identify a real payment. Acknowledge
    // that signed event so the endpoint test succeeds, but never update an
    // order unless Mercado Pago returns a real payment resource.
    if (paymentResponse.status === 404) return res.sendStatus(200);
    if (!paymentResponse.ok) return res.sendStatus(502);
    const payment = await paymentResponse.json();
    const orderId = payment.external_reference;
    const order = orderId ? await Order.findById(orderId) : null;
    if (!order || order.payment?.method !== "mercadopago") return res.sendStatus(200);

    const sameAmount = Math.abs(Number(payment.transaction_amount) - order.total) < 0.01;
    if (payment.currency_id !== "ARS" || !sameAmount) {
      console.error("Mercado Pago payment amount or currency did not match order", String(order._id));
      return res.sendStatus(200);
    }

    const receivedStatus = payment.status === "approved"
      ? "approved"
      : payment.status === "rejected"
        ? "rejected"
        : payment.status === "refunded" || payment.status === "charged_back"
          ? "refunded"
          : "pending";
    const status = order.payment.status === "approved" && ["pending", "rejected"].includes(receivedStatus)
      ? "approved"
      : receivedStatus;
    order.payment.status = status;
    order.payment.paymentId = String(payment.id);
    if (status === "approved") order.payment.paidAt = new Date(payment.date_approved || Date.now());
    await order.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Mercado Pago webhook processing failed:", error.message);
    res.sendStatus(500);
  }
};

export { getPaymentConfig, getPaymentStatus, mercadoPagoWebhook, verifyWebhookSignature };
