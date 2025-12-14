const router = require('express').Router();
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');
const { NOT_FOUND } = require('../utils/errors');

// ---------- PUBLIC ROUTES ----------
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

// ---------- PROTECTED ROUTES ----------
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// ---------- 404 CATCH-ALL ----------
router.all('*', (_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' });
});

module.exports = router;

