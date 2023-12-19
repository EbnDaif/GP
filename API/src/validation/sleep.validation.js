const Joi = require('joi');
const newSoundsValidation = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "any.required": "Please enter a Video name",
    "any.min": "Video name must be between 3 and 100 characters",
    "any.max": "Video name must be between 3 and 100 characters",
  }),
  tags:  Joi.string().required().trim().messages({
    "any.required": "Please provide a status for this Video",
  }),


  category: Joi.string().required().trim().messages({
    "any.required": "Please provide a status for this Video",
  }),

  description: Joi.string().required().messages({
    "any.required": "Please provide a content for this Video",
  }),
  URL: Joi.string().required().messages({
    "any.required": "Please provide a content for this Video",
  }),

  file: Joi.string(),

  publish_date: Joi.date().default(Date.now()),

  isPublished: Joi.boolean().required().messages({
    "any.required": "Please specify if you want to publish or draft",
  }),
});

const updateSoundsvalidation = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "any.min": "Video name must be between 3 and 100 characters",
    "any.max": "Video name must be between 3 and 100 characters",
  }),
  tags:  Joi.string().trim(),


  category: Joi.string().trim().messages({
    "any.required": "Please provide a category for this Video",
  }),

  content: Joi.string(),

  file: Joi.string(),
  URL: Joi.string().required().messages({
    "any.required": "Please provide a content for this Video",
  }),

  publish_date: Joi.date().default(Date.now()),

  // publish_by: Joi.string(),

  isPublished: Joi.boolean(),
});

module.exports = { newSoundsValidation, updateSoundsvalidation };
