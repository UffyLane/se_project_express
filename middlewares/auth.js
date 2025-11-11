const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

// Authorization middleware
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).json({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach payload to request
    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    res.status(UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};
