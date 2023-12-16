const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const userIdRegex = /^[0-9]{10}$/
module.exports = {
  updateUserProfileSchema: Joi.object({
    nationality: Joi.string(),
    age: Joi.number().integer().messages({
      "number.base": "Age must be a valid integer.",
    }),

    mobileNumber: Joi.number().integer().messages({
      "number.base": "Mobile number must be a valid integer.",
    }),
  }),
};