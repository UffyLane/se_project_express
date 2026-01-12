const router = require("express").Router();

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

// PUBLIC AUTH ROUTES
router.post("/signin", login);
router.post("/signup", createUser);

// PROTECTED ROUTES
router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

module.exports = router;
