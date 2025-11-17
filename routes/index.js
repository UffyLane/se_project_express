const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors');
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

// ✅ Mount the users router at '/users'
router.use('/users', usersRouter);

// ✅ Mount the router at '/items' instead of '/clothing-items'
router.use('/items', clothingItemsRouter);

// 404 fallback route
router.use((_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Not found' });
});

module.exports = router;
