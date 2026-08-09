import { Router } from "express";
import {
  getProducts,
  getPromotionProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { productSchema } from "../validations/productValidation.js";

const productRoutes = Router();

productRoutes.get("/", getProducts);
productRoutes.get("/promotions", getPromotionProducts);
productRoutes.get("/:id", getProductById);
productRoutes.post("/", authToken, requireAdmin, validate(productSchema), createProduct);
productRoutes.put("/:id", authToken, requireAdmin, validate(productSchema), updateProduct);
productRoutes.delete("/:id", authToken, requireAdmin, deleteProduct);

export { productRoutes };
