const pino = require('pino');
const env = require('./env');

const logger = pino({
  level: env.logLevel,
  ...(env.nodeEnv === 'development' && {
    transport: { target: 'pino-pretty', options: { colorize: true } },
  }),
});

module.exports = logger;
