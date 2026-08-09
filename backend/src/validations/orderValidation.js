import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const orderItemSchema = Joi.object({
  product: Joi.string().required().label("El producto"),
  name: Joi.string().required().label("El nombre"),
  price: Joi.number().min(0).required().label("El precio"),
  quantity: Joi.number().integer().min(1).required().label("La cantidad"),
}).messages(esMessages);

const orderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required().label("Los productos"),
  total: Joi.number().min(0).required().label("El total"),
  shipping: Joi.object({
    fullName: Joi.string().min(3).max(100).required().label("El nombre completo"),
    phone: Joi.string().min(6).max(30).required().label("El teléfono"),
    address: Joi.string().min(5).max(200).required().label("La dirección"),
    notes: Joi.string().max(300).allow("").optional().label("Las notas"),
  })
    .required()
    .label("Los datos de envío")
    .messages(esMessages),
}).messages(esMessages);

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pendiente", "confirmado", "enviado", "entregado", "cancelado")
    .required()
    .label("El estado"),
}).messages(esMessages);

export { orderSchema, updateOrderStatusSchema };
