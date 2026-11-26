const express = require('express');
const {
  getAllTickets,
  adminUpdateTicket,
  getDashboard,
  getAllActivity,
  getUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { adminUpdateTicketRules } = require('../middleware/validators');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/tickets', getAllTickets);
router.put('/tickets/:id', adminUpdateTicketRules, validate, adminUpdateTicket);
router.get('/activity', getAllActivity);
router.get('/users', getUsers);

module.exports = router;
