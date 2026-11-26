const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');
const { buildTicketQuery } = require('../utils/ticketQuery');
const eventService = require('../services/eventService');

/**
 * @desc    Get ALL tickets (admin only, paginated, searchable, sortable, filterable)
 * @route   GET /api/admin/tickets
 */
const getAllTickets = async (req, res, next) => {
  try {
    const baseFilter = {};
    if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
      baseFilter.createdBy = req.query.userId;
    }

    const { filter, sort, pageNum, limitNum } = buildTicketQuery(req.query, baseFilter);

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
 * @desc    Update ticket status/priority/assignment (admin)
 * @route   PUT /api/admin/tickets/:id
 */
const adminUpdateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    const oldStatus = ticket.status;
    const { status, priority, assignedTo } = req.body;

    const updateData = {};
    if (status && config.ticketStatus.includes(status)) updateData.status = status;
    if (priority && config.ticketPriority.includes(priority)) updateData.priority = priority;
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo === '' ? null : assignedTo;
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    eventService.emit('ticket.updated', {
      ticketId: ticket._id,
      userId: req.user.id,
      details: { updatedFields: Object.keys(updateData), adminUpdate: true, title: ticket.title }
    });

    if (status && status !== oldStatus) {
      eventService.emit('status.changed', {
        ticketId: ticket._id,
        userId: req.user.id,
        details: { from: oldStatus, to: status }
      });

      if (status === 'Resolved') {
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
 * @desc    Get dashboard stats (admin)
 * @route   GET /api/admin/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const [
      totalTickets,
      totalUsers,
      statusAgg,
      priorityAgg,
      categoryAgg,
      recentActivity
    ] = await Promise.all([
      Ticket.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      ActivityLog.find()
        .populate('userId', 'name email role')
        .populate('ticketId', 'title status priority')
        .sort({ timestamp: -1 })
        .limit(20)
    ]);

    const byStatus = Object.fromEntries(config.ticketStatus.map((s) => [s, 0]));
    statusAgg.forEach((item) => { byStatus[item._id] = item.count; });

    const byPriority = Object.fromEntries(config.ticketPriority.map((p) => [p, 0]));
    priorityAgg.forEach((item) => { byPriority[item._id] = item.count; });

    const byCategory = Object.fromEntries(config.ticketCategory.map((c) => [c, 0]));
    categoryAgg.forEach((item) => { byCategory[item._id] = item.count; });

    return ApiResponse.success(res, {
      totalTickets,
      totalUsers,
      byStatus,
      byPriority,
      byCategory,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all activity logs (admin)
 * @route   GET /api/admin/activity
 */
const getAllActivity = async (req, res, next) => {
  try {
    const {
      page = config.pagination.defaultPage,
      limit = config.pagination.defaultLimit,
      action
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || config.pagination.defaultPage);
    const limitNum = Math.min(
      Math.max(1, parseInt(limit, 10) || config.pagination.defaultLimit),
      config.pagination.maxLimit
    );

    const filter = {};
    if (action) filter.action = action;

    const [total, logs] = await Promise.all([
      ActivityLog.countDocuments(filter),
      ActivityLog.find(filter)
        .populate('userId', 'name email role')
        .populate('ticketId', 'title status')
        .sort({ timestamp: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
    ]);

    return ApiResponse.paginated(res, logs, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with ticket counts (admin)
 * @route   GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const [users, ticketCounts] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }),
      Ticket.aggregate([{ $group: { _id: '$createdBy', count: { $sum: 1 } } }])
    ]);

    const countMap = new Map(ticketCounts.map((item) => [String(item._id), item.count]));
    const usersWithStats = users.map((user) => ({
      ...user.toJSON(),
      ticketCount: countMap.get(String(user._id)) || 0
    }));

    return ApiResponse.success(res, usersWithStats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTickets, adminUpdateTicket, getDashboard, getAllActivity, getUsers };
