const jwt = require('jsonwebtoken');
const env = require('../config/env');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

module.exports = auth;
