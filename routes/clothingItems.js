const router = require('express').Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem
} = require('../controllers/clothingItems');

const {
  validateCreateItem,
  validateIdParam
} = require('../middlewares/validation');

router.get('/', getClothingItems);
router.post('/', validateCreateItem, createClothingItem);
router.delete('/:itemId', validateIdParam, deleteClothingItem);
router.put('/:itemId/likes', validateIdParam, likeClothingItem);
router.delete('/:itemId/likes', validateIdParam, dislikeClothingItem);

module.exports = router;
