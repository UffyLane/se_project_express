const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');

// Custom Error Classes
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// ================================
// GET /users/:userId
// ================================
module.exports.getProfile = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID format'));
      }
      return next(err);
    });
};

// ================================
// GET /users/me — return authorized user
// ================================
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .select('-password')
    .orFail(() => new NotFoundError('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID format'));
      }
      return next(err);
    });
};

// ================================
// POST /signin — login
// ================================
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Required WTWR validation
  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch((err) => {
      // WTWR requires checking ONLY message text
      if (err.message.includes('Invalid email or password')) {
        return next(new UnauthorizedError('Invalid email or password'));
      }
      return next(err);
    });
};

// ================================
// POST /signup — create new user
// ================================
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('User with this email already exists'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user data'));
      }
      return next(err);
    });
};

// ================================
// PATCH /users/me — update name & avatar
// ================================
module.exports.updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError('User not found'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user data'));
      }
      return next(err);
    });
};
