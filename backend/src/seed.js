const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const { User } = require('./models');
const logger = require('./config/logger');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const exists = await User.findOne({ where: { email: 'admin@primetrade.ai' } });
    if (!exists) {
      await User.create({
        name: 'Admin',
        email: 'admin@primetrade.ai',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
      });
      logger.info('Admin user seeded: admin@primetrade.ai / admin123');
    } else {
      logger.info('Admin user already exists, skipping seed');
    }

    process.exit(0);
  } catch (err) {
    logger.error(err, 'Seed failed');
    process.exit(1);
  }
};

seed();
