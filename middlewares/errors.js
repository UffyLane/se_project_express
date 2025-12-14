// middlewares/errors.js

// HTTP status codes
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

// Reusable error response helper
const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ message });

// Specific helpers (optional but convenient)
const badRequest = (res, message = 'Bad request') =>
  sendError(res, BAD_REQUEST, message);

const unauthorized = (res, message = 'Authorization required') =>
  sendError(res, UNAUTHORIZED, message);

const forbidden = (res, message = 'Forbidden') =>
  sendError(res, FORBIDDEN, message);

const notFound = (res, message = 'Requested resource not found') =>
  sendError(res, NOT_FOUND, message);

const conflict = (res, message = 'Conflict') =>
  sendError(res, CONFLICT, message);

const serverError = (res, message = 'An error occurred on the server') =>
  sendError(res, INTERNAL_SERVER_ERROR, message);

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
};
