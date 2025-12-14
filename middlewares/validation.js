// middlewares/validation.js

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Custom URL validator using validator.js
const urlValidation = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error('string.uri');
};

// =============================
// 1. VALIDATE CREATE CLOTHING ITEM
// =============================
module.exports.validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    imageUrl: Joi.string().required().custom(urlValidation),
  }),
});

// =============================
// 2. VALIDATE CREATE USER (SIGNUP)
// =============================
module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// =============================
// 3. VALIDATE LOGIN (SIGNIN)
// =============================
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// =============================
// 4. VALIDATE USER ID / ITEM ID PARAMS
// =============================
module.exports.validateIdParam = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
    itemId: Joi.string().hex().length(24),
  }),
});

// =============================
// 5. VALIDATE USER UPDATE (PATCH /users/me)
// =============================
module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(urlValidation),
  }),
});
