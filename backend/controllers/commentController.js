const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const ApiResponse = require('../utils/apiResponse');
const eventService = require('../services/eventService');

/**
 * @desc    Add comment to ticket
 * @route   POST /api/tickets/:id/comments
 */
const addComment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only comment on your own tickets');
    }

    const comment = await Comment.create({
      ticketId: req.params.id,
      userId: req.user.id,
      text: req.body.text
    });

    await comment.populate('userId', 'name email role');

    eventService.emit('comment.added', {
      ticketId: ticket._id,
      userId: req.user.id,
      details: { commentId: comment._id, preview: comment.text.substring(0, 100) }
    });

    return ApiResponse.created(res, comment, 'Comment added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for ticket
 * @route   GET /api/tickets/:id/comments
 */
const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return ApiResponse.notFound(res, 'Ticket not found');
    }

    if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user.id) {
      return ApiResponse.forbidden(res, 'You can only view comments on your own tickets');
    }

    const comments = await Comment.find({ ticketId: req.params.id })
      .populate('userId', 'name email role')
      .sort({ createdAt: 1 });

    return ApiResponse.success(res, comments);
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments };
