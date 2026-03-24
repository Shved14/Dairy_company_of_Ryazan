const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    next();
  };
};

module.exports = requireRole;
