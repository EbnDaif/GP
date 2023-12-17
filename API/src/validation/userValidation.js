const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const userIdRegex = /^[0-9]{10}$/
module.exports = {
  updateByAdminSchema: Joi.object({

    accountStatus: Joi.string().valid('Active', 'Inactive').messages({
        'any.only': 'Account status must be either "Active" or "Inactive".'
    }),
    role: Joi.string().valid('Admin', 'Editor', 'Instructor', 'Student').messages({
        'any.only': 'Invalid role. Allowed values are: Admin, Editor, Instructor, Student.'
    }),
}),
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