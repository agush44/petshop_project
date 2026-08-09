import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  message: Joi.string().min(10).max(1000).required(),
});

export { contactSchema };
