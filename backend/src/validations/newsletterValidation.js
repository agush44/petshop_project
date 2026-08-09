import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const newsletterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("El email"),
}).messages(esMessages);

export { newsletterSchema };
