const bcrypt = require("bcryptjs");
const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");
const sequelize = require("./config/db");
const { User } = require("./models");

const seedAdmin = async () => {
  const hashed = await bcrypt.hash("admin123", 12);
  const [user, created] = await User.findOrCreate({
    where: { email: "admin@primetrade.ai" },
    defaults: { name: "Admin", password: hashed, role: "admin" },
  });
  if (!created) {
    await user.update({ password: hashed });
    logger.info("Admin password reset");
  } else {
    logger.info("Admin user seeded");
  }
};

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected");

    await sequelize.sync({ alter: true });
    logger.info("Models synced");

    await seedAdmin();

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (err) {
    logger.fatal(err, "Failed to start server");
    process.exit(1);
  }
};

// graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");
  await sequelize.close();
  process.exit(0);
});

start();
