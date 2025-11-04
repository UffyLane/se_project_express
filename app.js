const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require('./routes/index'); // ✅ use index.js as main router

const app = express();
const { PORT = 3001 } = process.env;

// ✅ MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db';

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mount all routes (users + items)
app.use('/', mainRouter);

// ✅ Root route
app.get('/', (_req, res) => {
  res.send('Welcome to the Clothing Items API ✅');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
