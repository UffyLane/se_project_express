

// middlewares/auth.js
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // adjust path if yours differs
const { JWT_SECRET } = require('../utils/config'); // adjust if your config path differs

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  // Missing header or not Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization required'));
  }

  const token = authorization.replace('Bearer ', '').trim();

  // "Bearer " with no token
  if (!token) {
    return next(new UnauthorizedError('Authorization required'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload; // should contain {_id: "..."} from your login token
  return next();
};
