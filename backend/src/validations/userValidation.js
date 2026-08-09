import Joi from "joi";

const registerUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Email should be a string",
      "string.empty": "Email cannot be empty",
      "string.min": "Email should have a minimum length of 3",
      "string.max": "Email should have a maximum length of 30",
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have a minimum length of 6",
    "any.required": "Password is required",
  }),
});

const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email should be a string",
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
  password: Joi.string().required().messages({
    "string.base": "Password should be a string",
    "any.required": "Password is required",
  }),
});

export { registerUserSchema, loginUserSchema };
