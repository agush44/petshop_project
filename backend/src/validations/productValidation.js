import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).max(500).optional(),
  category: Joi.string()
    .valid("alimentos", "accesorios", "piedras sanitarias", "golosinas y snacks")
    .required(),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.string()
    .pattern(/^https?:\/\/.*cloudinary\.com\/.*$/i)
    .optional(),
  imageAlt: Joi.string().max(150).allow("").optional(),
  animalType: Joi.string().valid("Perros", "Gatos", "Otros").required(),
  createdAt: Joi.date()
    .default(() => new Date())
    .iso(),

  discount: Joi.number().min(0).max(100).optional(),
  discountExpiresAt: Joi.date().iso().allow(null).optional(),
});

export { productSchema };
