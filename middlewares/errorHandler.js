const { INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports = (err, _req, res, _next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? 'An error occurred on the server'
        : message,
  });
};
