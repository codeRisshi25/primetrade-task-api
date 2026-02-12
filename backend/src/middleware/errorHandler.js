const logger = require('../config/logger');

const errorHandler = (err, _req, res, _next) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
