const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwr_db';

// ✅ Middleware order
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.get('/', (_req, res) => {
  res.send('Welcome to the Clothing Items API ✅');
});

app.use('/users', mainRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
