const router = require('express').Router();
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

// ✅ Mount the users router at '/users'
router.use('/users', usersRouter);

// ✅ Mount the router at '/items' instead of '/clothing-items'
router.use('/items', clothingItemsRouter);

// 404 fallback route
router.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = router;
