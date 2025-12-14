const router = require('express').Router();
const { getClothingItems } = require('../controllers/clothingItems');

// Public GET all items
router.get('/', getClothingItems);

module.exports = router;
