const router = require('express').Router();

const {
  getCurrentUser,
  updateCurrentUser,
  getProfile,
} = require('../controllers/users');

const {
  validateUpdateUser,
  validateIdParam,
} = require('../middlewares/validation');

// ======================================
// GET /users/me — return logged-in user
// ======================================
router.get('/me', getCurrentUser);

// ======================================
// PATCH /users/me — update logged-in user
// ======================================
router.patch('/me', validateUpdateUser, updateCurrentUser);

// ======================================
// GET /users/:userId — optional WTWR route
// ======================================
router.get('/:userId', validateIdParam, getProfile);

module.exports = router;
