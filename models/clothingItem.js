const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [30, 'Name must be no more than 30 characters'],
  },
  weather: {
    type: String,
    required: [true, 'Weather type is required'],
    validate: {
      validator: (v) => ['hot', 'warm', 'cold'].includes(v.toLowerCase()),
      message: (props) => `${props.value} is not a valid weather type!`,
    },
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Invalid image URL',
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
