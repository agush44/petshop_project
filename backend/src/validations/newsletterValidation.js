import Joi from "joi";

const newsletterSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
});

export { newsletterSchema };
