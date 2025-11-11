const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // ⬇️ return here so function exits early
    return res.status(UNAUTHORIZED).json({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    // ⬇️ explicitly return next() so ESLint sees a value returned
    return next();
  } catch (err) {
    console.error(err);
    // ⬇️ also return here to cover all paths
    return res
      .status(UNAUTHORIZED)
      .json({ message: 'Invalid or expired token' });
  }
};
