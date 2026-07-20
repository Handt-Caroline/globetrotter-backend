require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger (observability starts here)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'GlobeTrotter API is running' });
});

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Example of a protected route, for testing the middleware:
const authMiddleware = require('./middleware/auth');
app.get('/protected-test', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', userId: req.userId });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));