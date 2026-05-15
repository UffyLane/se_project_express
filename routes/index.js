const router = require('express').Router();

const userRouter = require('./users');
const itemRouter = require('./clothingItems');

const { login, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');

const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

// PUBLIC AUTH ROUTES
router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

// PROTECTED ROUTES
router.use('/users', auth, userRouter);
router.use('/items', itemRouter);

// 404 HANDLER
router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;