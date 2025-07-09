const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bluebirdhub-super-secret-key');
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Ungültiger Token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    },
    process.env.JWT_SECRET || 'bluebirdhub-super-secret-key',
    { expiresIn: '24h' }
  );
};

module.exports = { verifyToken, generateToken };