const router = require("express").Router();

const { validateLogin, validateCreateUser } = require('../middlewares/validation');

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

// PUBLIC AUTH ROUTES
router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

// PROTECTED ROUTES
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

module.exports = router;
