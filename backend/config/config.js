require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk',
  useMemoryDb: process.env.USE_MEMORY_DB === 'true',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_dev_only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@helpdesk.local'
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100
  },
  roles: {
    USER: 'user',
    ADMIN: 'admin'
  },
  ticketStatus: ['Open', 'In Progress', 'Resolved', 'Closed'],
  ticketPriority: ['Low', 'Medium', 'High', 'Urgent'],
  ticketCategory: ['General', 'Bug', 'Feature', 'Account'],
  sortableFields: ['createdAt', 'updatedAt', 'priority', 'status', 'title']
};
