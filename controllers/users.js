const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require('../utils/errors');

// POST /signin — authenticate user and return JWT
// POST /signin — authenticate user and return JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required WTWR validation
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);

    // WTWR-required check — ONLY use message
    if (
      err.message === 'Invalid email or password' ||
      err.message.includes('Invalid email or password')
    ) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: 'Invalid email or password' });
    }


    // return 500 here
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};



// GET /users/me — return the current authorized user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, '-password').orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

// POST /signup — create new user
const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Email and password are required' });
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

    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res
        .status(CONFLICT)
        .json({ message: 'User with this email already exists' });
    }

    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Invalid user data' });
    }

    return res
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
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Invalid user data' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'User not found' });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred while updating user' });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
