const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload file
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen' });
  }
  
  const fileInfo = {
    id: Date.now(),
    name: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    uploadedBy: req.user.userId,
    uploadedAt: new Date()
  };
  
  res.json(fileInfo);
});

module.exports = router;