import Joi from "joi";

const postSectionSchema = Joi.object({
  anchor: Joi.string().min(2).max(60).required(),
  heading: Joi.string().min(2).max(150).required(),
  content: Joi.string().min(5).required(),
});

const postSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(150)
    .required(),
  excerpt: Joi.string().min(10).max(300).required(),
  coverImage: Joi.string().uri().optional(),
  coverImageAlt: Joi.string().max(150).allow("").optional(),
  author: Joi.string().max(100).optional(),
  sections: Joi.array().items(postSectionSchema).min(1).required(),
  published: Joi.boolean().optional(),
});

export { postSchema };
