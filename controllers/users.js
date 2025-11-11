const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
} = require('../utils/errors');
const { UNAUTHORIZED } = require('../utils/errors');

// PATCH /users/:id — update user info (name and avatar)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, avatar },
      {
        new: true, // return the updated document
        runValidators: true, // run schema validators
      }
    ).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user data' });
    }

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error updating user information' });
  }
};

// POST /login — authenticate user and return JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use custom mongoose method to verify credentials
    const user = await User.findUserByCredentials(email, password);

    // Create token with 7-day expiration
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);

    // If authentication fails, send 401
    res.status(UNAUTHORIZED).json({ message: 'Invalid email or password' });
  }
};

// GET /users — return all users (without passwords)
const getUsers = async (_req, res) => {
  try {
    // ✅ Explicitly exclude password
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

/// GET /users/me — return the current authorized user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, '-password').orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};


// POST /users — create new user (with password hashing and duplicate handling)
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(CONFLICT).json({ message: 'User with this email already exists' });
    }

    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user data' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred while creating user' });
  }
};

// PATCH /users/me — update current user's name and avatar
const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true } // ✅ ensures validation runs
    ).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user data' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred while updating user' });
  }
};


module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
