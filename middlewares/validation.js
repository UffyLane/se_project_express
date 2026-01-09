const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Custom URL validator
const urlValidation = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error('string.uri');
};

// =============================
// VALIDATORS
// =============================

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    imageUrl: Joi.string().required().custom(urlValidation),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateIdParam = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
    itemId: Joi.string().hex().length(24),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(urlValidation),
  }),
});

// =============================
// EXPORTS (IMPORTANT)
// =============================

module.exports = {
  validateCreateItem,
  validateCreateUser,
  validateLogin,
  validateIdParam,
  validateUpdateUser,
};
