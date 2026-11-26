const EventEmitter = require('events');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendNotificationEmail } = require('./emailService');

class EventService extends EventEmitter {
  constructor() {
    super();
    this._pendingTasks = new Set();
    this._registerListeners();
  }

  /**
   * Track async listener execution so tests can await event completion via flush()
   */
  _track(fn) {
    return (payload) => {
      const promise = Promise.resolve()
        .then(() => fn(payload))
        .catch((err) => {
          console.error('EventService listener error:', err.message);
        })
        .finally(() => {
          this._pendingTasks.delete(promise);
        });
      this._pendingTasks.add(promise);
    };
  }

  async flush() {
    while (this._pendingTasks.size > 0) {
      await Promise.allSettled(Array.from(this._pendingTasks));
    }
  }

  async _notifyAdmins({ ticketId, title, message, type, excludeUserId }) {
    const admins = await User.find({ role: 'admin' }).select('_id email name');
    const recipients = admins.filter((a) => a._id.toString() !== String(excludeUserId));

    if (recipients.length === 0) return;

    await Notification.insertMany(
      recipients.map((admin) => ({
        userId: admin._id,
        ticketId,
        title,
        message,
        type
      }))
    );

    await Promise.all(
      recipients.map((admin) =>
        sendNotificationEmail({
          to: admin.email,
          subject: `[Helpdesk] ${title}`,
          text: message
        })
      )
    );
  }

  async _notifyUser({ userId, ticketId, title, message, type }) {
    if (!userId) return;
    await Notification.create({
      userId,
      ticketId,
      title,
      message,
      type
    });

    const user = await User.findById(userId).select('email name');
    if (user?.email) {
      await sendNotificationEmail({
        to: user.email,
        subject: `[Helpdesk] ${title}`,
        text: message
      });
    }
  }

  _registerListeners() {
    this.on('ticket.created', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'ticket.created',
        details: details || { message: 'Ticket was created' }
      });

      const creator = await User.findById(userId).select('name');
      await this._notifyAdmins({
        ticketId,
        title: 'New Support Ticket',
        message: `${creator?.name || 'A user'} submitted ticket "${details?.title || 'Untitled'}" (${details?.priority || 'Medium'} priority).`,
        type: 'ticket_created',
        excludeUserId: userId
      });
    }));

    this.on('ticket.updated', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'ticket.updated',
        details: details || { message: 'Ticket was updated' }
      });
    }));

    this.on('status.changed', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'status.changed',
        details: details || { message: 'Ticket status was changed' }
      });

      const ticket = await Ticket.findById(ticketId).select('title createdBy');
      if (ticket && ticket.createdBy.toString() !== String(userId)) {
        await this._notifyUser({
          userId: ticket.createdBy,
          ticketId,
          title: 'Ticket Status Updated',
          message: `Your ticket "${ticket.title}" changed status from ${details?.from} to ${details?.to}.`,
          type: 'status_changed'
        });
      }
    }));

    this.on('comment.added', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'comment.added',
        details: details || { message: 'Comment was added' }
      });

      const [ticket, commenter] = await Promise.all([
        Ticket.findById(ticketId).select('title createdBy assignedTo'),
        User.findById(userId).select('name role')
      ]);

      if (!ticket) return;

      if (ticket.createdBy.toString() !== String(userId)) {
        await this._notifyUser({
          userId: ticket.createdBy,
          ticketId,
          title: 'New Support Reply',
          message: `${commenter?.name || 'Support'} commented on "${ticket.title}".`,
          type: 'comment_added'
        });
      } else {
        await this._notifyAdmins({
          ticketId,
          title: 'New User Comment',
          message: `${commenter?.name || 'User'} replied on ticket "${ticket.title}".`,
          type: 'comment_added',
          excludeUserId: userId
        });
      }
    }));

    this.on('ticket.resolved', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'ticket.resolved',
        details: details || { message: 'Ticket was resolved' }
      });

      const ticket = await Ticket.findById(ticketId).select('title createdBy');
      if (ticket && ticket.createdBy.toString() !== String(userId)) {
        await this._notifyUser({
          userId: ticket.createdBy,
          ticketId,
          title: 'Ticket Resolved',
          message: `Your ticket "${ticket.title}" has been marked as Resolved.`,
          type: 'ticket_resolved'
        });
      }
    }));

    this.on('ticket.deleted', this._track(async ({ ticketId, userId, details }) => {
      await ActivityLog.create({
        ticketId,
        userId,
        action: 'ticket.deleted',
        details: details || { message: 'Ticket was deleted' }
      });
    }));
  }
}

const eventService = new EventService();

module.exports = eventService;
