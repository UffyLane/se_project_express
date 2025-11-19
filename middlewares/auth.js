const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    // ❗ required by WTWR: same message for invalid token
    return res
      .status(UNAUTHORIZED)
      .json({ message: 'Authorization required' });
  }
};
