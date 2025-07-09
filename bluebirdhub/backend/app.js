const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaces');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');
const commentRoutes = require('./routes/comments');
const aiRoutes = require('./routes/ai');
const documentRoutes = require('./routes/documents');

// Database
const { sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body Parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bluebirdhub Backend läuft!',
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Etwas ist schiefgelaufen!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Interner Serverfehler'
  });
});

// Database Connection & Server Start
sequelize.authenticate()
  .then(() => {
    console.log('Datenbankverbindung erfolgreich hergestellt.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Bluebirdhub Backend läuft auf Port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('Fehler beim Starten des Servers:', err);
  });