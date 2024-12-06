// routers/adminRouter.js
const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register admin', details: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

// Protected route example
router.get('/protected', isAdmin, (req, res) => {
  res.json({ message: `Welcome, ${req.admin.username}!` });
});

module.exports = router;