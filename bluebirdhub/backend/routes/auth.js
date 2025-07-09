const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, verifyToken } = require('../middleware/auth');
const router = express.Router();

// Initialize demo users
const initDemoUsers = async () => {
  try {
    const demoUsers = [
      { username: 'user1', password: 'pass123', displayName: 'Demo User 1', email: 'user1@bluebirdhub.com' },
      { username: 'user2', password: 'pass123', displayName: 'Demo User 2', email: 'user2@bluebirdhub.com' },
      { username: 'user3', password: 'pass123', displayName: 'Demo User 3', email: 'user3@bluebirdhub.com' }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`Demo user ${userData.username} created`);
      }
    }
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
};

// Initialize demo users on startup
initDemoUsers();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich' });
    }
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
    }
    
    // Update last login
    await user.update({ lastLoginAt: new Date() });
    
    const token = generateToken(user);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username,
        displayName: user.displayName,
        email: user.email
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ 
    user: { 
      id: req.user.id, 
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email
    } 
  });
});

// Get current user profile
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { displayName, email } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    
    await user.update({ displayName, email });
    
    res.json({ 
      message: 'Profil erfolgreich aktualisiert',
      user: { 
        id: user.id, 
        username: user.username,
        displayName: user.displayName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profil-Update fehlgeschlagen' });
  }
});

module.exports = router;