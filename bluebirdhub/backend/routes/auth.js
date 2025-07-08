const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Demo users
const DEMO_USERS = [
  { id: 1, username: 'user1', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }, // pass123
  { id: 2, username: 'user2', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }, // pass123
  { id: 3, username: 'user3', password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }  // pass123
];

const JWT_SECRET = 'bluebirdhub-secret-key';

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = DEMO_USERS.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
  }
  
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ 
    token, 
    user: { id: user.id, username: user.username } 
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

module.exports = { router, verifyToken };