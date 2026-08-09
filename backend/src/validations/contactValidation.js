import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label("El nombre"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("El email"),
  message: Joi.string().min(10).max(1000).required().label("El mensaje"),
}).messages(esMessages);

export { contactSchema };
