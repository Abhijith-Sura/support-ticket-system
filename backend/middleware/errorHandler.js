const ApiResponse = require('../utils/apiResponse');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return ApiResponse.badRequest(res, 'Invalid resource ID format');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.badRequest(res, `Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return ApiResponse.badRequest(res, 'Validation failed', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token has expired');
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  return ApiResponse.error(res, message, statusCode);
};

/**
 * Not found handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  return ApiResponse.notFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = { errorHandler, notFoundHandler };
