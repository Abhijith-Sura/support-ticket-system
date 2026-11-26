const { body, param } = require('express-validator');
const config = require('../config/config');

const objectIdRule = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const createTicketRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .optional()
    .isIn(config.ticketCategory).withMessage(`Category must be one of: ${config.ticketCategory.join(', ')}`),
  body('priority')
    .optional()
    .isIn(config.ticketPriority).withMessage(`Priority must be one of: ${config.ticketPriority.join(', ')}`)
];

const updateTicketRules = [
  ...objectIdRule,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
  body('category')
    .optional()
    .isIn(config.ticketCategory).withMessage(`Category must be one of: ${config.ticketCategory.join(', ')}`),
  body('priority')
    .optional()
    .isIn(config.ticketPriority).withMessage(`Priority must be one of: ${config.ticketPriority.join(', ')}`),
  body('status')
    .optional()
    .isIn(config.ticketStatus).withMessage(`Status must be one of: ${config.ticketStatus.join(', ')}`)
];

const adminUpdateTicketRules = [
  ...objectIdRule,
  body('status')
    .optional()
    .isIn(config.ticketStatus).withMessage(`Status must be one of: ${config.ticketStatus.join(', ')}`),
  body('priority')
    .optional()
    .isIn(config.ticketPriority).withMessage(`Priority must be one of: ${config.ticketPriority.join(', ')}`),
  body('assignedTo')
    .optional({ nullable: true })
    .custom((val) => val === null || val === '' || /^[0-9a-fA-F]{24}$/.test(val))
    .withMessage('assignedTo must be a valid user ID or null')
];

const commentRules = [
  ...objectIdRule,
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters')
];

module.exports = {
  objectIdRule,
  registerRules,
  loginRules,
  createTicketRules,
  updateTicketRules,
  adminUpdateTicketRules,
  commentRules
};
