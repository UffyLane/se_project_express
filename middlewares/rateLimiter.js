const rateLimit = require("express-rate-limit");

// Basic DoS protection: limit repeated requests
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

module.exports = rateLimiter;
