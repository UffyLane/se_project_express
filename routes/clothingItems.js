const router = require('express').Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require('../controllers/clothingItems');

const auth = require('../middlewares/auth');

const {
  validateCreateItem,
  validateIdParam,
} = require('../middlewares/validation');

// ================================
// PUBLIC
// ================================
router.get('/', getClothingItems);

// ================================
// PROTECTED
// ================================
router.post('/', auth, validateCreateItem, createClothingItem);

router.delete('/:itemId', auth, validateIdParam, deleteClothingItem);

router.put('/:itemId/likes', auth, validateIdParam, likeClothingItem);
router.delete('/:itemId/likes', auth, validateIdParam, dislikeClothingItem);

module.exports = router;
