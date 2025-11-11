const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {login, createUser} = require('./controllers/users');
const mainRouter = require('./routes/index'); // ✅ use index.js as main router
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const itemRouter = require('./routes/clothingItems');
const { getItems } = require('./controllers/clothingItems');

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
  .then(() => ('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mount all routes (users + items)
app.use('/', mainRouter);

// ✅ Root route
app.get('/', (_req, res) => {
  res.send('Welcome to the Clothing Items API ✅');
});

// eslint-disable-next-line no-console
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Public routes
app.post('/signup', createUser);
app.post('/signin', login);
app.get('/items', getItems); // this one stays public

// Protect all routes below this line
app.use(auth);

// Protected routes
app.use('/users', userRouter);
app.use('/items', itemRouter);

module.exports = app;
