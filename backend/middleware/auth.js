const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');

/**
 * Verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Not authorized, user not found');
    }

    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Not authorized, token invalid');
  }
};

/**
 * Restrict access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Not authorized');
    }
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'You do not have permission to perform this action');
    }
    next();
  };
};

module.exports = { protect, authorize };
