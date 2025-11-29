const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors');
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const ClothingItem = require('../models/clothingItem');


// ---------- PUBLIC ROUTES ----------
router.post('/signup', createUser);
router.post('/signin', login);

// >>> PUBLIC GET /items <<<
router.get("/items", async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.send(items);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});


// ---------- PROTECTED ROUTES ----------
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// ---------- 404 CATCH-ALL ----------
router.all('*', (_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' });
});

module.exports = router;
