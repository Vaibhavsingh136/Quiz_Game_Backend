const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRouter = require('./routers/userRouter');
const adminRouter = require('./routers/adminRouter');
const errorHandler = require('./middlewares/errorHandler');
const jwt = require('jsonwebtoken');

dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', userRouter);   // Participant routes
app.use('/admin', adminRouter);  // Admin routes

// Global Error Handler
app.use(errorHandler);

// JWT Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Example of generating a JWT token (use this in the login route for admin or users)
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Starting the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
