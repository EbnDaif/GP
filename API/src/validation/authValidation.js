const Joi = require("joi")
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const userIdRegex = /^[0-9]{10}$/
module.exports = {
  registerSchema: Joi.object({
    firstName: Joi.string().required().messages({
      "any.required": "First name is required.",
      "string.empty": "First name must not be empty.",
    }),
    lastName: Joi.string().required().messages({
      "any.required": "Last name is required.",
      "string.empty": "Last name must not be empty.",
    }),
    email: Joi.string().required().email().messages({
      "any.required": "Email is required.",
      "string.empty": "Email must not be empty.",
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
      "any.required": "Password is required.",
      "string.empty": "Password must not be empty.",
      "string.pattern.base":
        "Password must contain at least 8 characters, including one digit, one lowercase letter, one uppercase letter, and one special character.",
    }),
    gender:Joi.string().valid("male", "female").required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().required().email().messages({
      "any.required": "Email is required.",
      "string.empty": "Email must not be empty.",
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
      "any.required": "Password is required.",
      "string.empty": "Password must not be empty.",
      "string.pattern.base":
        "Password must contain at least 8 characters, including one digit, one lowercase letter, one uppercase letter, and one special character.",
    }),
  }),
};