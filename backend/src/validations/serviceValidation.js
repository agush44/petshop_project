import Joi from "joi";

const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).max(500).required(),
  price: Joi.number().positive().precision(2).required(),
  durationMinutes: Joi.number().integer().min(0).optional(),
  image: Joi.string().uri().optional(),
  active: Joi.boolean().optional(),
});

export { serviceSchema };
