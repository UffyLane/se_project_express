const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes'); // CENTRAL ROUTER
const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

// DB URL
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// DB connect
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Mount central router (handles signup, signin, auth-protected routes)
app.use(routes);

// Unknown route handler
app.use('*', (_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' });
});

// Start server
app.listen(PORT, () => {
  console.warn(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
