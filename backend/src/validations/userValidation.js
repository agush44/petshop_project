import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const registerUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(30)
    .required()
    .label("El email"),
  password: Joi.string().min(6).required().label("La contraseña"),
}).messages(esMessages);

const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("El email"),
  password: Joi.string().required().label("La contraseña"),
}).messages(esMessages);

export { registerUserSchema, loginUserSchema };
