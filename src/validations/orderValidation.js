const Joi = require("joi");

const createOrderValidation = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "string.empty": "Product id is required",
          "any.required": "Product id is required",
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product is required",
      "any.required": "Items are required",
    }),
});

module.exports = {
  createOrderValidation,
};
