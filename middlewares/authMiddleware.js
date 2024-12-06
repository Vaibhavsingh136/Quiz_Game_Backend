// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized access' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: 'Invalid token' });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

module.exports = { isAdmin };