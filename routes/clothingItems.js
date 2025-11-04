const router = require('express').Router();


const {createClothingItem, getClothingItems, updateClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

router.post('/', createClothingItem);
router.get('/', getClothingItems);
router.put('/:id', updateClothingItem);
router.delete('/:id', deleteClothingItem);

module.exports = router;