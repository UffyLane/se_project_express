const router = require('express').Router();

const userRouter = require('./users');
const itemRouter = require('./clothingItems');

const auth = require('../middlewares/auth');

// USERS (protected)
router.use('/users', auth, userRouter);

// ITEMS
// GET /items is public inside itemRouter
// POST/DELETE/LIKES are protected inside itemRouter
router.use('/items', itemRouter);

module.exports = router;
