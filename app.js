const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { getClothingItems: getItems } = require('./controllers/clothingItems');
const userRouter = require('./routes/users');
const itemRouter = require('./routes/clothingItems');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NOT_FOUND } = require('./utils/errors');

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
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


  // ✅ Temporary test middleware to set default user ID
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // required by tests
  };
  next();
});


// ✅ Root route
app.get('/', (_req, res) => {
  res.send('Welcome to the Clothing Items API ✅');
});

// ✅ Public routes
app.post('/signup', createUser);
app.post('/signin', login);
app.get('/items', getItems); // stays public

// ✅ Protected routes
app.use(auth);
app.use('/users', userRouter);
app.use('/items', itemRouter);

// ✅ Handle unknown routes
app.use('*', (_req, res) => {
  res.status(NOT_FOUND).json({ message: 'Requested resource not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.warn(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
