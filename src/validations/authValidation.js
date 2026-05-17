const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
  }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase and number",
    }),

  role: Joi.string().valid("user", "admin").optional(),
});

const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = {
  registerValidation,
  loginValidation,
};
