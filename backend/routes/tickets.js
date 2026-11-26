const express = require('express');
const {
  getTickets,
  getTicketStats,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  getTicketActivity
} = require('../controllers/ticketController');
const commentRoutes = require('./comments');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  objectIdRule,
  createTicketRules,
  updateTicketRules
} = require('../middleware/validators');

const router = express.Router();

router.use(protect);

router.get('/stats', getTicketStats);
router.get('/', getTickets);
router.post('/', createTicketRules, validate, createTicket);

router.get('/:id', objectIdRule, validate, getTicket);
router.put('/:id', updateTicketRules, validate, updateTicket);
router.delete('/:id', objectIdRule, validate, deleteTicket);
router.get('/:id/activity', objectIdRule, validate, getTicketActivity);

router.use('/:id/comments', commentRoutes);

module.exports = router;
