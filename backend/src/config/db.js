const { Sequelize } = require("sequelize");
const env = require("./env");
const logger = require("./logger");

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: (msg) => logger.debug(msg),
  pool: { max: 10, min: 2, idle: 10000 },
  ...(env.nodeEnv === "production" && {
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  }),
});

module.exports = sequelize;
