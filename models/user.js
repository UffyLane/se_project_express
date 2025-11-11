const mongoose = require('mongoose');
const validator = require('validator');

// Define user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [30, 'Name must be at most 30 characters long'],
    },
    avatar: {
      type: String,
      default:
        'https://avatars.githubusercontent.com/u/placeholder', // optional default
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Invalid avatar URL format',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // ✅ Ensures 11000 duplicate key error on duplicates
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // ✅ Exclude from query results by default
    },
  },
  {
    versionKey: false, // removes "__v"
  }
);

// Ensure password is never exposed when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const bcrypt = require('bcryptjs');

// Custom static method for verifying email + password
userSchema.statics.findUserByCredentials = async function (email, password) {
  // Find the user and explicitly include password since it's excluded by default
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare provided password with hashed password
  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error('Invalid email or password');
  }

  return user;
};


module.exports = mongoose.model('User', userSchema);
