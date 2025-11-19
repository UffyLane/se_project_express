const express = require('express');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require('../controllers/clothingItems');

const router = express.Router();

// GET all items
router.get('/', getClothingItems);

// POST a new item
router.post('/', createClothingItem);

// DELETE an item by ID
router.delete('/:itemId', deleteClothingItem);

// LIKE an item
router.put('/:itemId/likes', likeClothingItem);

// DISLIKE an item
router.delete('/:itemId/likes', dislikeClothingItem);

module.exports = router;
