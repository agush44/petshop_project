import Order from "../models/order.js";
import Product from "../models/product.js";
import { getFinalPrice } from "../utils/pricing.js";

// El precio y el total nunca se toman del body: se recalculan acá a partir
// del producto real en la base. Si se confiara en lo que manda el cliente,
// cualquiera podría alterar el request y comprar a un precio inventado.
const createOrder = async (req, res) => {
  try {
    const requestedItems = req.body.items;

    const products = await Product.find({
      _id: { $in: requestedItems.map((item) => item.product) },
    });
    const productsById = new Map(products.map((p) => [String(p._id), p]));

    const items = requestedItems.map((requested) => {
      const product = productsById.get(String(requested.product));
      if (!product) {
        throw Object.assign(new Error(`Producto ${requested.product} no encontrado`), {
          status: 400,
        });
      }
      return {
        product: product._id,
        name: product.name,
        price: getFinalPrice(product),
        quantity: requested.quantity,
      };
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const paymentMethod = req.body.paymentMethod || "whatsapp";
    if (paymentMethod === "mercadopago" && (!process.env.MP_ACCESS_TOKEN || !process.env.MP_WEBHOOK_SECRET)) {
      return res.status(503).json({ message: "Mercado Pago todavía no está configurado." });
    }

    const order = new Order({
      items,
      total,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "whatsapp" ? "not_required" : "pending",
      },
      shipping: req.body.shipping,
      user: req.user?.id,
    });

    if (paymentMethod === "mercadopago") {
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      const backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;
      const preferenceBody = {
        items: items.map((item) => ({
          id: String(item.product),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        })),
        external_reference: String(order._id),
        back_urls: {
          success: `${frontendUrl}/checkout?payment=success&order=${order._id}`,
          failure: `${frontendUrl}/checkout?payment=failure&order=${order._id}`,
          pending: `${frontendUrl}/checkout?payment=pending&order=${order._id}`,
        },
        auto_return: "approved",
      };
      if (backendUrl?.startsWith("https://")) {
        preferenceBody.notification_url = `${backendUrl.replace(/\/$/, "")}/api/payments/webhook`;
      }

      const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceBody),
      });
      const preference = await mpResponse.json();
      if (!mpResponse.ok || !preference.id || !preference.init_point) {
        console.error("Mercado Pago preference creation failed", preference.message || preference.error || mpResponse.status);
        return res.status(502).json({ message: "No se pudo iniciar el pago en Mercado Pago. Intentá nuevamente." });
      }

      order.payment.preferenceId = preference.id;
      await order.save();
      const checkoutUrl = process.env.MP_ENVIRONMENT === "test"
        ? preference.sandbox_init_point || preference.init_point
        : preference.init_point;
      return res.status(201).json({ order, checkoutUrl });
    }

    await order.save();
    const transfer = {
      bankName: process.env.TRANSFER_BANK_NAME || "",
      accountHolder: process.env.TRANSFER_ACCOUNT_HOLDER || "",
      taxId: process.env.TRANSFER_TAX_ID || "",
      cbu: process.env.TRANSFER_CBU || "",
      alias: process.env.TRANSFER_ALIAS || "",
      accountType: process.env.TRANSFER_ACCOUNT_TYPE || "",
    };
    res.status(201).json({ order, transfer });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (req.user.role !== "admin" && String(order.user) !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};

const confirmOrderWhatsapp = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { whatsappConfirmedAt: new Date() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error confirming order" });
  }
};

const confirmBankTransfer = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.payment?.method !== "transfer") {
      return res.status(409).json({ message: "El pedido no fue creado con transferencia." });
    }
    if (order.payment.status === "approved") return res.status(200).json(order);
    order.payment.status = "approved";
    order.payment.paidAt = new Date();
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error confirming bank transfer" });
  }
};

export { createOrder, getOrders, getOrderById, updateOrderStatus, confirmOrderWhatsapp, confirmBankTransfer };
