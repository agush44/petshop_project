import Order from "../models/order.js";

const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user?.id,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
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
