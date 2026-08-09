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

    const order = new Order({
      items,
      total,
      shipping: req.body.shipping,
      user: req.user?.id,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
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

export { createOrder, getOrders, getOrderById, updateOrderStatus, confirmOrderWhatsapp };
