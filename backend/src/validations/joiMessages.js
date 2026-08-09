// Mensajes de error de Joi traducidos, reutilizados en todos los schemas
// de validación para que la UI (100% en español) nunca muestre el inglés
// por defecto de Joi. Se aplica con schema.messages(esMessages); cada campo
// usa .label("...") para que {#label} salga en español.
export const esMessages = {
  "string.base": "{{#label}} debe ser un texto",
  "string.empty": "{{#label}} no puede estar vacío",
  "string.min": "{{#label}} debe tener al menos {{#limit}} caracteres",
  "string.max": "{{#label}} no puede superar los {{#limit}} caracteres",
  "string.email": "{{#label}} debe ser un email válido",
  "string.pattern.base": "{{#label}} tiene un formato inválido",
  "string.uri": "{{#label}} debe ser una URL válida",
  "number.base": "{{#label}} debe ser un número",
  "number.min": "{{#label}} debe ser mayor o igual a {{#limit}}",
  "number.max": "{{#label}} debe ser menor o igual a {{#limit}}",
  "number.positive": "{{#label}} debe ser un número positivo",
  "number.integer": "{{#label}} debe ser un número entero",
  "number.precision": "{{#label}} tiene demasiados decimales",
  "date.base": "{{#label}} debe ser una fecha válida",
  "date.iso": "{{#label}} debe tener formato de fecha ISO",
  "array.min": "{{#label}} debe tener al menos {{#limit}} elemento(s)",
  "any.required": "{{#label}} es obligatorio",
  "any.only": "{{#label}} no es un valor válido",
  "boolean.base": "{{#label}} debe ser verdadero o falso",
};
