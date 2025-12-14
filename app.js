const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');


const app = express();
const { PORT = 3001 } = process.env;

// MongoDB URL
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db';

// ---------- CORS ----------
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ---------- Standard Middleware ----------
app.use(helmet());
app.use(express.json());

// Prevent favicon 401
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// ---------- DB CONNECTION ----------
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// ---------- LOGGING: request FIRST ----------
app.use(requestLogger);

// ---------- ROUTES ----------
app.use(routes);

// ---------- LOGGING: errors AFTER routes ----------
app.use(errorLogger);

// ---------- CELEBRATE VALIDATION ERRORS ----------
app.use(errors());

// ---------- CUSTOM ERROR HANDLER ----------
app.use(errorHandler);

// ---------- START SERVER ----------
app.listen(PORT, "0.0.0.0", () => {
  console.warn(`🚀 Backend running at http://0.0.0.0:${PORT}`);
});

module.exports = app;
