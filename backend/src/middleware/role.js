const role = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Insufficient permissions' });
  }
  next();
};

module.exports = role;
