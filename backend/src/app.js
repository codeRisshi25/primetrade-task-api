const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const env = require('./config/env');
const logger = require('./config/logger');
const { globalLimiter } = require('./config/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const swaggerSetup = require('./docs/swagger');

// routes
const authRoutes = require('./v1/routes/authRoutes');
const taskRoutes = require('./v1/routes/taskRoutes');
const userRoutes = require('./v1/routes/userRoutes');

const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: env.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(globalLimiter);

// health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// api v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// swagger docs
swaggerSetup(app);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// error handler
app.use(errorHandler);

module.exports = app;
