const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['ticket.created', 'ticket.updated', 'status.changed', 'comment.added', 'ticket.resolved', 'ticket.deleted']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes
activityLogSchema.index({ ticketId: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
