const Joi = require("joi");

const createProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name cannot exceed 200 characters",
  }),

  description: Joi.string().trim().max(2000).allow("").optional(),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),

  isActive: Joi.boolean().optional(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(200),

  description: Joi.string().trim().max(2000).allow(""),

  price: Joi.number().min(0),

  stock: Joi.number().integer().min(0),

  isActive: Joi.boolean(),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
};
