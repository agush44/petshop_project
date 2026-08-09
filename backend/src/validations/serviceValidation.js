import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().label("El nombre"),
  description: Joi.string().min(5).max(500).required().label("La descripción"),
  price: Joi.number().positive().precision(2).required().label("El precio"),
  durationMinutes: Joi.number().integer().min(0).optional().label("La duración"),
  image: Joi.string().uri().optional().label("La imagen"),
  active: Joi.boolean().optional().label("El estado"),
}).messages(esMessages);

export { serviceSchema };
