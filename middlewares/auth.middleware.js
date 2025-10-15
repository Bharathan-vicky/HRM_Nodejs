// middlewares/auth.middleware.js
const { verifyAccessToken } = require('../utils/token.util');
const User = require('../models/User.model');

/**
 * auth middleware
 * @param {Array} roles - Optional array of roles allowed to access the route, e.g., ['Admin']
 */
const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });

      // Attach user to request
      req.user = user;

      // Role check if roles are specified
      if (roles.length && !roles.includes(user.role.toLowerCase())) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token', detail: err.message });
    }
  };
};

module.exports = auth;
