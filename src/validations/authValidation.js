const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase and number"
    })
});

const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().required()
});

module.exports = {
  registerValidation,
  loginValidation
};