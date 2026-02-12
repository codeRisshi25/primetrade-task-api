const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const sequelize = require('./config/db');

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: env.nodeEnv === 'development' });
    logger.info('Models synced');

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (err) {
    logger.fatal(err, 'Failed to start server');
    process.exit(1);
  }
};

// graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down');
  await sequelize.close();
  process.exit(0);
});

start();
