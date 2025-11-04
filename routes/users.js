const router = require('express').Router();
const { getUsers, createUser, getUserById } = require('../controllers/users');
const User = require('../models/user');


router.get('/', getUsers);

router.get('/:id', getUserById);


router.post('/', createUser);



module.exports = router;