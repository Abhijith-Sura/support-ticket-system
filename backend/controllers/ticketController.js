const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');
const { buildTicketQuery } = require('../utils/ticketQuery');
const eventService = require('../services/eventService');

/**
 * @desc    Get user's tickets (paginated, searchable, sortable, filterable)
 * @route   GET /api/tickets
 */
const getTickets = async (req, res, next) => {
  try {
    const { filter, sort, pageNum, limitNum } = buildTicketQuery(req.query, {
      createdBy: req.user.id
    });

    const [total, tickets] = await Promise.all([
      Ticket.countDocuments(filter),
      Ticket.find(filter)
        .populate('createdBy', 'name email role')
        .populate('assignedTo', 'name email role')
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
    ]);

    return ApiResponse.paginated(res, tickets, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ticket statistics for the authenticated user
 * @route   GET /api/tickets/stats
 */
const getTicketStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, statusAgg, priorityAgg] = await Promise.all([
      Ticket.countDocuments({ createdBy: userId }),
      Ticket.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Ticket.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    const byStatus = Object.fromEntries(config.ticketStatus.map((s) => [s, 0]));
    statusAgg.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    const byPriority = Object.fromEntries(config.ticketPriority.map((p) => [p, 0]));
    priorityAgg.forEach((item) => {
      byPriority[item._id] = item.count;
    });

    return ApiResponse.success(res, { totalTickets: total, byStatus, byPriority });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 */
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'General',
      priority: priority || 'Medium',
      createdBy: req.user.id
    });

    await ticket.populate('createdBy', 'name email role');

    eventService.emit('ticket.created', {
      ticketId: ticket._id,
      userId: req.user.id,
      details: { title: ticket.title, category: ticket.category, priority: ticket.priority }
    });

    return ApiResponse.created(res, ticket, 'Ticket created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single ticket
 * @route   GET /api/tickets/:id
 */
const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    if (req.user.role !== 'admin' && ticket.createdBy._id.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only view your own tickets');
    }

    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update ticket
 * @route   PUT /api/tickets/:id
 */
const updateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && ticket.createdBy.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only update your own tickets');
    }

    // Users can edit their own tickets only while Open or In Progress
    if (!isAdmin && ['Resolved', 'Closed'].includes(ticket.status)) {
      return ApiResponse.forbidden(res, 'Cannot edit a ticket that is already Resolved or Closed');
    }

    const oldStatus = ticket.status;
    const { title, description, category, priority, status } = req.body;

    if (!isAdmin && status !== undefined && status !== oldStatus) {
      return ApiResponse.forbidden(res, 'Only administrators can change ticket status');
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category && config.ticketCategory.includes(category)) updateData.category = category;
    if (priority && config.ticketPriority.includes(priority)) updateData.priority = priority;
    if (isAdmin && status && config.ticketStatus.includes(status)) updateData.status = status;

    ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    eventService.emit('ticket.updated', {
      ticketId: ticket._id,
      userId: req.user.id,
      details: { updatedFields: Object.keys(updateData), title: ticket.title }
    });

    if (updateData.status && updateData.status !== oldStatus) {
      eventService.emit('status.changed', {
        ticketId: ticket._id,
        userId: req.user.id,
        details: { from: oldStatus, to: updateData.status }
      });

      if (updateData.status === 'Resolved') {
        eventService.emit('ticket.resolved', {
          ticketId: ticket._id,
          userId: req.user.id,
          details: { previousStatus: oldStatus }
        });
      }
    }

    return ApiResponse.success(res, ticket, 'Ticket updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete ticket
 * @route   DELETE /api/tickets/:id
 */
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && ticket.createdBy.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only delete your own tickets');
    }

    if (!isAdmin && ['Resolved', 'Closed'].includes(ticket.status)) {
      return ApiResponse.forbidden(res, 'Resolved or closed tickets cannot be deleted');
    }

    eventService.emit('ticket.deleted', {
      ticketId: ticket._id,
      userId: req.user.id,
      details: { title: ticket.title, previousStatus: ticket.status }
    });

    await Promise.all([
      Comment.deleteMany({ ticketId: ticket._id }),
      Ticket.findByIdAndDelete(req.params.id)
    ]);

    return ApiResponse.success(res, null, 'Ticket deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get activity log for a ticket
 * @route   GET /api/tickets/:id/activity
 */
const getTicketActivity = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only view activity for your own tickets');
    }

    const activity = await ActivityLog.find({ ticketId: req.params.id })
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 });

    return ApiResponse.success(res, activity);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketStats,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  getTicketActivity
};
