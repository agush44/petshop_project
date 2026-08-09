import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "alimentos",
        "accesorios",
        "piedras sanitarias",
        "golosinas y snacks",
      ],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    imageAlt: {
      type: String,
      trim: true,
    },
    animalType: {
      type: String,
      enum: ["Perros", "Gatos", "Otros"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discountExpiresAt: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
