process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_jest';

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../server');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const eventService = require('../services/eventService');

let mongoServer;
let adminToken;
let user1Token;
let user2Token;
let adminUser;
let user1;
let user2;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await eventService.flush();
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await eventService.flush();
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }

  adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@helpdesk.com',
    password: 'password123',
    role: 'admin'
  });

  user1 = await User.create({
    name: 'Alice User',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user'
  });

  user2 = await User.create({
    name: 'Bob User',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user'
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@helpdesk.com', password: 'password123' });
  adminToken = adminLogin.body.data.token;

  const user1Login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'password123' });
  user1Token = user1Login.body.data.token;

  const user2Login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'bob@example.com', password: 'password123' });
  user2Token = user2Login.body.data.token;
});

describe('Health Check', () => {
  it('GET /api/health returns 200 and connected status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.database).toBe('connected');
  });
});

describe('Authentication & Authorization', () => {
  it('registers a new user with role fixed to user even if role=admin is sent', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'password123',
        role: 'admin'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice Two', email: 'alice@example.com', password: 'password123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns current user on GET /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe('alice@example.com');
  });

  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.statusCode).toBe(401);
  });

  it('prevents non-admin users from accessing admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(403);
  });
});

describe('Tickets CRUD, Filtering & RBAC', () => {
  it('creates a ticket, emits ticket.created event, and logs activity + admin notification', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Cannot access billing portal',
        description: 'Clicking billing redirects me back to the dashboard repeatedly.',
        category: 'Account',
        priority: 'High'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Cannot access billing portal');
    expect(res.body.data.status).toBe('Open');

    await eventService.flush();

    const logs = await ActivityLog.find({ ticketId: res.body.data._id });
    expect(logs.some((l) => l.action === 'ticket.created')).toBe(true);

    const adminNotes = await Notification.find({ userId: adminUser._id });
    expect(adminNotes.length).toBeGreaterThanOrEqual(1);
    expect(adminNotes[0].type).toBe('ticket_created');
  });

  it('validates ticket payload on creation', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Hi', description: 'Short' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('enforces ticket ownership on GET/PUT/DELETE', async () => {
    const ticket = await Ticket.create({
      title: 'Alice private issue',
      description: 'Detailed private issue description for Alice.',
      createdBy: user1._id
    });

    const getRes = await request(app)
      .get(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(getRes.statusCode).toBe(403);

    const putRes = await request(app)
      .put(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ title: 'Hijacked title' });
    expect(putRes.statusCode).toBe(403);

    const delRes = await request(app)
      .delete(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(delRes.statusCode).toBe(403);
  });

  it('blocks regular users from changing ticket status directly', async () => {
    const ticket = await Ticket.create({
      title: 'User status test ticket',
      description: 'Testing that regular users cannot mark tickets resolved.',
      createdBy: user1._id
    });

    const res = await request(app)
      .put(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ status: 'Resolved' });

    expect(res.statusCode).toBe(403);
  });

  it('supports search (with regex special chars), filters, sorting, pagination, and user stats', async () => {
    await Ticket.insertMany([
      {
        title: 'Safari (v17) crash on upload',
        description: 'App freezes during file upload.',
        category: 'Bug',
        priority: 'Urgent',
        status: 'Open',
        createdBy: user1._id
      },
      {
        title: 'Feature request: dark theme',
        description: 'Would love a dark theme across pages.',
        category: 'Feature',
        priority: 'Low',
        status: 'Resolved',
        createdBy: user1._id
      },
      {
        title: 'Bob ticket should stay hidden',
        description: 'Another user ticket.',
        category: 'General',
        priority: 'Medium',
        status: 'Open',
        createdBy: user2._id
      }
    ]);

    const searchRes = await request(app)
      .get('/api/tickets?search=(v17)&status=Open&priority=Urgent')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.data).toHaveLength(1);
    expect(searchRes.body.pagination.total).toBe(1);

    const statsRes = await request(app)
      .get('/api/tickets/stats')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(statsRes.statusCode).toBe(200);
    expect(statsRes.body.data.totalTickets).toBe(2);
    expect(statsRes.body.data.byStatus.Open).toBe(1);
    expect(statsRes.body.data.byStatus.Resolved).toBe(1);
  });

  it('allows user to delete own Open ticket, but forbids deleting Resolved ticket', async () => {
    const openTicket = await Ticket.create({
      title: 'Deletable open ticket',
      description: 'Created by mistake and still open.',
      status: 'Open',
      createdBy: user1._id
    });

    const resolvedTicket = await Ticket.create({
      title: 'Already resolved ticket',
      description: 'Should be preserved as resolved record.',
      status: 'Resolved',
      createdBy: user1._id
    });

    const okDel = await request(app)
      .delete(`/api/tickets/${openTicket._id}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(okDel.statusCode).toBe(200);

    const forbiddenDel = await request(app)
      .delete(`/api/tickets/${resolvedTicket._id}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(forbiddenDel.statusCode).toBe(403);
  });
});

describe('Admin Management, Comments, Events & Notifications', () => {
  it('allows admin to filter all tickets, update status to Resolved, emit events, and notify user', async () => {
    const ticket = await Ticket.create({
      title: 'Production login latency spike',
      description: 'Login requests are taking over 8 seconds intermittently.',
      category: 'Bug',
      priority: 'High',
      status: 'Open',
      createdBy: user1._id
    });

    const listRes = await request(app)
      .get('/api/admin/tickets?priority=High')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data).toHaveLength(1);

    const updateRes = await request(app)
      .put(`/api/admin/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Resolved', priority: 'Urgent', assignedTo: adminUser._id.toString() });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.status).toBe('Resolved');
    expect(updateRes.body.data.priority).toBe('Urgent');

    await eventService.flush();

    const activityRes = await request(app)
      .get(`/api/tickets/${ticket._id}/activity`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(activityRes.statusCode).toBe(200);
    const actions = activityRes.body.data.map((a) => a.action);
    expect(actions).toContain('status.changed');
    expect(actions).toContain('ticket.resolved');

    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(notifRes.statusCode).toBe(200);
    expect(notifRes.body.data.unreadCount).toBeGreaterThanOrEqual(1);

    const markAllRes = await request(app)
      .put('/api/notifications/read-all')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(markAllRes.statusCode).toBe(200);
  });

  it('supports user and admin comments while restricting unrelated users', async () => {
    const ticket = await Ticket.create({
      title: 'Comment authorization test',
      description: 'Testing comments between ticket owner and admin.',
      createdBy: user1._id
    });

    const userComment = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'Here is extra context from me.' });
    expect(userComment.statusCode).toBe(201);

    const adminComment = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ text: 'We are investigating this now.' });
    expect(adminComment.statusCode).toBe(201);
    expect(adminComment.body.data.userId.role).toBe('admin');

    const otherComment = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ text: 'Should not be allowed.' });
    expect(otherComment.statusCode).toBe(403);

    const getComments = await request(app)
      .get(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(getComments.statusCode).toBe(200);
    expect(getComments.body.data).toHaveLength(2);
  });

  it('returns admin dashboard metrics and user list', async () => {
    await Ticket.create({
      title: 'Dashboard metric verification',
      description: 'Testing admin dashboard totals and counts.',
      category: 'Feature',
      priority: 'Medium',
      status: 'Open',
      createdBy: user1._id
    });

    const dashRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(dashRes.statusCode).toBe(200);
    expect(dashRes.body.data.totalTickets).toBe(1);
    expect(dashRes.body.data.totalUsers).toBe(2);

    const usersRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(usersRes.statusCode).toBe(200);
    expect(usersRes.body.data.length).toBe(3);
  });
});
