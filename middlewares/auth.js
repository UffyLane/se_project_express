// middlewares/auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Must exist and be "Bearer <token>"
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach user id to request
    req.user = payload;

    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
  }
};

