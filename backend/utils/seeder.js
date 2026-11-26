const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const seedDatabase = async ({ reset = true, quiet = false } = {}) => {
  if (reset) {
    await Promise.all([
      ActivityLog.deleteMany({}),
      Notification.deleteMany({}),
      Comment.deleteMany({}),
      Ticket.deleteMany({}),
      User.deleteMany({})
    ]);
  }

  // Create default admin + 5 sample users
  const admin = await User.create({
    name: 'Admin Support',
    email: 'admin@helpdesk.com',
    password: 'admin123',
    role: 'admin'
  });

  const users = await User.create([
    { name: 'Alice Johnson', email: 'user@helpdesk.com', password: 'user123', role: 'user' },
    { name: 'Bob Martinez', email: 'bob@example.com', password: 'password123', role: 'user' },
    { name: 'Carol Chen', email: 'carol@example.com', password: 'password123', role: 'user' },
    { name: 'David Patel', email: 'david@example.com', password: 'password123', role: 'user' },
    { name: 'Eva Williams', email: 'eva@example.com', password: 'password123', role: 'user' }
  ]);

  const sampleTicketsData = [
    {
      title: 'Cannot reset account password from settings page',
      description: 'When I click "Forgot Password" or try updating my password under Account Settings, the confirmation email never arrives and the page throws a 500 timeout.',
      category: 'Account',
      priority: 'Urgent',
      status: 'Open',
      createdBy: users[0]._id
    },
    {
      title: 'Dashboard charts fail to load on Safari 17',
      description: 'Opening the analytics view on macOS Safari shows a blank white canvas while Chrome renders the charts normally. Console logs an SVG sizing warning.',
      category: 'Bug',
      priority: 'High',
      status: 'In Progress',
      createdBy: users[0]._id,
      assignedTo: admin._id
    },
    {
      title: 'Export ticket history to CSV report',
      description: 'It would be very helpful for our monthly operations review if users could export filtered tickets to a downloadable CSV spreadsheet.',
      category: 'Feature',
      priority: 'Medium',
      status: 'Open',
      createdBy: users[0]._id
    },
    {
      title: 'Two-factor authentication recovery codes missing',
      description: 'After enabling 2FA on my profile, the modal closed before I could download my backup recovery codes. Need assistance regenerating them.',
      category: 'Account',
      priority: 'High',
      status: 'Resolved',
      createdBy: users[0]._id,
      assignedTo: admin._id
    },
    {
      title: 'Billing invoice PDF displays wrong tax line item',
      description: 'Our October invoice shows duplicate regional GST lines in the downloadable PDF summary even though the card charge amount was accurate.',
      category: 'General',
      priority: 'Medium',
      status: 'Closed',
      createdBy: users[0]._id,
      assignedTo: admin._id
    },
    {
      title: 'API webhook retries flooding endpoint with duplicates',
      description: 'Our webhook receiver returns 200 OK within 400ms, yet the webhook dispatcher retries 3 additional times with identical payload IDs.',
      category: 'Bug',
      priority: 'Urgent',
      status: 'In Progress',
      createdBy: users[1]._id,
      assignedTo: admin._id
    },
    {
      title: 'Dark mode toggle resets after page refresh',
      description: 'Switching theme preference in the navigation bar does not persist in localStorage after reloading the browser tab.',
      category: 'Bug',
      priority: 'Low',
      status: 'Open',
      createdBy: users[1]._id
    },
    {
      title: 'Add Slack notification integration for urgent tickets',
      description: 'Allow workspace admins to connect a Slack incoming webhook URL so Urgent tickets immediately notify the #oncall channel.',
      category: 'Feature',
      priority: 'Medium',
      status: 'Open',
      createdBy: users[1]._id
    },
    {
      title: 'Update company billing email address',
      description: 'We changed our finance team distribution alias from billing@old.io to ap@newcorp.io and need all future receipts routed there.',
      category: 'Account',
      priority: 'Low',
      status: 'Resolved',
      createdBy: users[2]._id,
      assignedTo: admin._id
    },
    {
      title: 'File attachments larger than 5MB hang indefinitely',
      description: 'Uploading a 6.4MB screen recording stays at 99% progress without showing a validation message for maximum file size.',
      category: 'Bug',
      priority: 'High',
      status: 'Open',
      createdBy: users[2]._id
    },
    {
      title: 'Question regarding SLA response times for Enterprise tier',
      description: 'Can you clarify whether Urgent priority tickets include 24/7 weekend coverage under our current annual agreement?',
      category: 'General',
      priority: 'Low',
      status: 'Closed',
      createdBy: users[2]._id,
      assignedTo: admin._id
    },
    {
      title: 'SSO SAML login redirects to 404 callback URL',
      description: 'After authenticating via Okta SAML assertion, users are redirected to /auth/saml/callback which returns a 404 Not Found response.',
      category: 'Account',
      priority: 'Urgent',
      status: 'Open',
      createdBy: users[3]._id
    },
    {
      title: 'Keyboard shortcuts for quick ticket triage',
      description: 'Adding shortcuts like J/K to navigate tickets and R to reply would greatly speed up daily triage workflows.',
      category: 'Feature',
      priority: 'Low',
      status: 'Open',
      createdBy: users[3]._id
    },
    {
      title: 'Search query with special characters crashes list view',
      description: 'Typing parentheses or brackets into the search bar causes a backend regex exception instead of returning empty results.',
      category: 'Bug',
      priority: 'High',
      status: 'Resolved',
      createdBy: users[3]._id,
      assignedTo: admin._id
    },
    {
      title: 'Bulk archive resolved tickets older than 90 days',
      description: 'We need an admin maintenance option or automated policy to archive tickets resolved more than 90 days ago.',
      category: 'Feature',
      priority: 'Medium',
      status: 'In Progress',
      createdBy: users[4]._id,
      assignedTo: admin._id
    },
    {
      title: 'Mobile navigation drawer overlaps ticket badges',
      description: 'On 375px mobile viewports, the hamburger menu remains partially transparent over priority pill badges.',
      category: 'Bug',
      priority: 'Medium',
      status: 'Open',
      createdBy: users[4]._id
    },
    {
      title: 'Role permissions documentation clarification',
      description: 'Could you share a clear matrix showing which actions standard users versus administrators can execute?',
      category: 'General',
      priority: 'Low',
      status: 'Resolved',
      createdBy: users[4]._id,
      assignedTo: admin._id
    },
    {
      title: 'Session expires prematurely during long ticket write-ups',
      description: 'Drafting a detailed bug report for 20 minutes loses unsaved text if the user token refreshes.',
      category: 'Bug',
      priority: 'High',
      status: 'In Progress',
      createdBy: users[1]._id,
      assignedTo: admin._id
    }
  ];

  const tickets = await Ticket.insertMany(sampleTicketsData);

  // Create sample comments
  const commentsData = [
    {
      ticketId: tickets[0]._id,
      userId: users[0]._id,
      text: 'I also tested with a secondary email address and experienced the exact same timeout error.'
    },
    {
      ticketId: tickets[1]._id,
      userId: admin._id,
      text: 'We reproduced this in Safari 17.4 and are testing a responsive SVG height fix.'
    },
    {
      ticketId: tickets[1]._id,
      userId: users[0]._id,
      text: 'Thanks for the quick update! Let me know when the patch is ready to verify.'
    },
    {
      ticketId: tickets[3]._id,
      userId: admin._id,
      text: 'We have reset your 2FA recovery flow and emailed a fresh set of one-time codes.'
    },
    {
      ticketId: tickets[5]._id,
      userId: admin._id,
      text: 'Investigating webhook idempotency keys on worker queue #3. Temporary rate smoothing applied.'
    },
    {
      ticketId: tickets[13]._id,
      userId: admin._id,
      text: 'Deployed regex escaping on all search filters. Tested with special characters and everything passes cleanly.'
    }
  ];
  await Comment.insertMany(commentsData);

  // Create activity logs reflecting lifecycle events
  const activityLogs = [];
  tickets.forEach((t) => {
    activityLogs.push({
      ticketId: t._id,
      userId: t.createdBy,
      action: 'ticket.created',
      details: { title: t.title, category: t.category, priority: t.priority },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5))
    });

    if (t.status === 'In Progress') {
      activityLogs.push({
        ticketId: t._id,
        userId: admin._id,
        action: 'status.changed',
        details: { from: 'Open', to: 'In Progress' },
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 43200000))
      });
    } else if (t.status === 'Resolved') {
      activityLogs.push({
        ticketId: t._id,
        userId: admin._id,
        action: 'status.changed',
        details: { from: 'In Progress', to: 'Resolved' },
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 21600000))
      });
      activityLogs.push({
        ticketId: t._id,
        userId: admin._id,
        action: 'ticket.resolved',
        details: { previousStatus: 'In Progress' },
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 21600000))
      });
    }
  });

  commentsData.forEach((c) => {
    activityLogs.push({
      ticketId: c.ticketId,
      userId: c.userId,
      action: 'comment.added',
      details: { preview: c.text.substring(0, 80) },
      timestamp: new Date()
    });
  });

  await ActivityLog.insertMany(activityLogs);

  // Sample notifications
  await Notification.insertMany([
    {
      userId: users[0]._id,
      ticketId: tickets[1]._id,
      title: 'New Support Reply',
      message: `Admin Support commented on "${tickets[1].title}".`,
      type: 'comment_added',
      isRead: false
    },
    {
      userId: users[0]._id,
      ticketId: tickets[3]._id,
      title: 'Ticket Resolved',
      message: `Your ticket "${tickets[3].title}" has been marked as Resolved.`,
      type: 'ticket_resolved',
      isRead: true
    },
    {
      userId: admin._id,
      ticketId: tickets[0]._id,
      title: 'New Support Ticket',
      message: `Alice Johnson submitted urgent ticket "${tickets[0].title}".`,
      type: 'ticket_created',
      isRead: false
    }
  ]);

  if (!quiet) {
    console.log(`Seeded 1 admin, ${users.length} users, ${tickets.length} tickets, ${commentsData.length} comments, and ${activityLogs.length} activity logs.`);
  }

  return { admin, users, tickets };
};

module.exports = { seedDatabase };
