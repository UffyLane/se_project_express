const router = require('express').Router();
const clothingItemsRouter = require('./clothingItems');

router.use('/clothing-items', clothingItemsRouter);

router.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = router;


