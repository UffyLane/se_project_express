const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      default: 'https://avatars.githubusercontent.com/u/placeholder',
      validate: {
        validator(url) {
          return validator.isURL(url);
        },
        message: 'Invalid avatar URL format',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
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
userSchema.methods.toJSON = function toJSONSafe() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Custom static method for verifying email + password
userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error('Invalid email or password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);

