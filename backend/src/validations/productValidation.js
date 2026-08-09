import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("El nombre"),
  description: Joi.string().min(5).max(500).optional().label("La descripción"),
  category: Joi.string()
    .valid("alimentos", "accesorios", "piedras sanitarias", "golosinas y snacks")
    .required()
    .label("La categoría"),
  price: Joi.number().positive().precision(2).required().label("El precio"),
  stock: Joi.number().integer().min(0).required().label("El stock"),
  image: Joi.string()
    .pattern(/^https?:\/\/.*cloudinary\.com\/.*$/i)
    .optional()
    .label("La imagen"),
  imageAlt: Joi.string().max(150).allow("").optional().label("El texto alternativo"),
  animalType: Joi.string().valid("Perros", "Gatos", "Otros").required().label("La mascota"),
  createdAt: Joi.date()
    .default(() => new Date())
    .iso(),

  discount: Joi.number().min(0).max(100).optional().label("El descuento"),
  discountExpiresAt: Joi.date().iso().allow(null).optional().label("La fecha de expiración"),
}).messages(esMessages);

export { productSchema };
