import Joi from "joi";

const orderItemSchema = Joi.object({
  product: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const orderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  total: Joi.number().min(0).required(),
  shipping: Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(6).max(30).required(),
    address: Joi.string().min(5).max(200).required(),
    notes: Joi.string().max(300).allow("").optional(),
  }).required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pendiente", "confirmado", "enviado", "entregado", "cancelado")
    .required(),
});

export { orderSchema, updateOrderStatusSchema };
