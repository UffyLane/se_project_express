const express = require('express');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require('../controllers/clothingItems'); // ❌ removed .default

const router = express.Router();

// ✅ GET all items
router.get('/', getClothingItems);

// ✅ POST a new item
router.post('/', createClothingItem);

// ✅ DELETE an item by ID
router.delete('/:id', deleteClothingItem);

// ✅ PUT like on an item
router.put('/:id/likes', likeClothingItem);

// ✅ DELETE like (dislike) on an item
router.delete('/:id/likes', dislikeClothingItem);

module.exports = router;
