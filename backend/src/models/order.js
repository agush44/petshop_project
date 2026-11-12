import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    payment: {
      method: { type: String, enum: ["whatsapp", "transfer", "mercadopago"], default: "whatsapp" },
      status: { type: String, enum: ["not_required", "pending", "approved", "rejected", "refunded"], default: "not_required" },
      preferenceId: { type: String },
      paymentId: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    shipping: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      notes: { type: String, trim: true },
    },
    whatsappConfirmedAt: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
