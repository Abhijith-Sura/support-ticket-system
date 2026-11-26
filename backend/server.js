const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const config = require('./config/config');
const connectDB = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Trust first proxy (required for Render/Koyeb/Nginx rate-limiting & IP headers)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration
const allowedOrigins = config.corsOrigin === '*'
  ? true
  : config.corsOrigin.split(',').map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Request logging (skip in test mode)
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'test' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Support Ticket Management API is running',
    environment: config.nodeEnv,
    database: dbStates[mongoose.connection.readyState] || 'unknown',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve built React frontend in single-container production Docker image
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(path.join(publicDir, 'index.html'))) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
