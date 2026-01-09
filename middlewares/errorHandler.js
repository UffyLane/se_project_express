const { INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports = (err, req, res, _next) => {
  // Log the real error so we can see why /items is 500
  console.error('🔥 ERROR:', err);
  if (err && err.stack) {
    console.error(err.stack);
  }

  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? 'An error occurred on the server'
        : message,
  });
};

