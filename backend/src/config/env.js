require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtExpiry: '15m',
  jwtRefreshExpiry: '7d',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};
