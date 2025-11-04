const User = require('../models/user');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../utils/errors');

// GET /users — return all users
const getUsers = async (_req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

// POST /users — create a new user
const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newUser = await User.create({ name, avatar });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);

    // ✅ Distinguish validation errors (400) from unexpected ones (500)
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user data' });
    }

    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred while creating user' });
  }
};

// GET /users/:id — return a specific user
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Automatically throw a 404 if user isn’t found
    const user = await User.findById(id).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      // Invalid ObjectId format
      return res.status(BAD_REQUEST).json({ message: 'Invalid user ID' });
    }

    if (err.statusCode === NOT_FOUND) {
      // .orFail() triggered
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    // Catch-all for server errors
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
};
