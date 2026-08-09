import Joi from "joi";
import { esMessages } from "./joiMessages.js";

const postSectionSchema = Joi.object({
  anchor: Joi.string().min(2).max(60).required().label("El ancla"),
  heading: Joi.string().min(2).max(150).required().label("El título de sección"),
  content: Joi.string().min(5).required().label("El contenido"),
}).messages(esMessages);

const postSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().label("El título"),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(150)
    .required()
    .label("El slug"),
  excerpt: Joi.string().min(10).max(300).required().label("El resumen"),
  coverImage: Joi.string().uri().optional().label("La imagen de portada"),
  coverImageAlt: Joi.string().max(150).allow("").optional().label("El alt de la imagen"),
  author: Joi.string().max(100).optional().label("El autor"),
  sections: Joi.array().items(postSectionSchema).min(1).required().label("Las secciones"),
  published: Joi.boolean().optional().label("El estado de publicación"),
}).messages(esMessages);

export { postSchema };
