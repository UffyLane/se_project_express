const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

// DB URL
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db';

// ---------- CORS (Correct for Vite) ----------
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware
app.use(helmet());
app.use(express.json());

// ---------- Public Routes ----------
app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // 🔥 prevents 401 favicon errors

// DB connect
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------- Central Router ----------
app.use(routes);

// Unknown route handler
app.use('*', (_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' });
});

// Start backend
app.listen(PORT, () => {
  console.warn(`🚀 Backend running at http://localhost:${PORT}`);
});

module.exports = app;
