const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  weather: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Invalid image URL'
    }
  }
});

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);

module.exports = ClothingItem;