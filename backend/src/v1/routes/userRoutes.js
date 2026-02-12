const router = require('express').Router();
const { User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin only
 */
router.get('/', auth, role('admin'), async (_req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
