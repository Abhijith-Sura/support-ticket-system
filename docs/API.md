# REST API Documentation

**Base URL:** `http://localhost:5000/api`  
**Authentication:** Bearer JWT (`Authorization: Bearer <token>`)

All responses use a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```
Paginated responses also include:
```json
"pagination": {
  "page": 1,
  "limit": 10,
  "total": 18,
  "pages": 2
}
```

---

## 1. Health Check

### `GET /api/health`
Returns server and MongoDB connection status.
- **Auth:** Public
- **Response `200`:**
```json
{
  "success": true,
  "status": "ok",
  "message": "Support Ticket Management API is running",
  "environment": "development",
  "database": "connected",
  "uptime": 12,
  "timestamp": "2026-11-26T08:00:00.000Z"
}
```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
Registers a new standard user (`role` is always `'user'`).
- **Auth:** Public
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Response `201`:** Returns `{ user: { id, name, email, role }, token }`.
- **Errors:** `400` validation failure or duplicate email.

### `POST /api/auth/login`
Authenticates user/admin and issues a 24-hour JWT.
- **Auth:** Public
- **Body:**
```json
{
  "email": "user@helpdesk.com",
  "password": "user123"
}
```
- **Response `200`:** Returns `{ user: { id, name, email, role }, token }`.
- **Errors:** `401` invalid email or password.

### `GET /api/auth/me`
Returns the currently authenticated user's profile.
- **Auth:** Bearer Token
- **Response `200`:** `{ user: { id, name, email, role, createdAt } }`.

---

## 3. Tickets (`/api/tickets`)

### `GET /api/tickets/stats`
Returns ticket aggregate counts (`totalTickets`, `byStatus`, `byPriority`) for the logged-in user.
- **Auth:** Bearer Token

### `GET /api/tickets`
Returns paginated tickets created by the authenticated user.
- **Auth:** Bearer Token
- **Query Params:**
  - `page` (default `1`)
  - `limit` (default `10`, max `100`)
  - `status` (`Open` | `In Progress` | `Resolved` | `Closed`)
  - `priority` (`Low` | `Medium` | `High` | `Urgent`)
  - `category` (`General` | `Bug` | `Feature` | `Account`)
  - `search` (case-insensitive substring across title & description)
  - `sortBy` (`createdAt` | `updatedAt` | `priority` | `status` | `title`)
  - `sortOrder` (`asc` | `desc`)

### `POST /api/tickets`
Creates a new ticket and emits `ticket.created`.
- **Auth:** Bearer Token
- **Body:**
```json
{
  "title": "Login page throws 500 error",
  "description": "Submitting valid credentials occasionally returns HTTP 500.",
  "category": "Bug",
  "priority": "High"
}
```
- **Response `201`:** Created ticket document.

### `GET /api/tickets/:id`
Retrieves a single ticket (owner or admin only).
- **Auth:** Bearer Token
- **Errors:** `403` if accessing another user's ticket, `404` if not found.

### `PUT /api/tickets/:id`
Updates a ticket and emits `ticket.updated`.
- **Auth:** Bearer Token (owner or admin)
- **Rules:** Standard users cannot update `Resolved`/`Closed` tickets and cannot change `status` directly (`403`).
- **Body:** Any of `{ title, description, category, priority }` (admins may also pass `status`).

### `DELETE /api/tickets/:id`
Deletes a ticket and associated comments, logging `ticket.deleted`.
- **Auth:** Bearer Token (owner or admin)
- **Rules:** Standard users cannot delete `Resolved` or `Closed` tickets (`403`).

### `GET /api/tickets/:id/activity`
Retrieves chronological activity logs for a ticket (owner or admin).

---

## 4. Comments (`/api/tickets/:id/comments`)

### `GET /api/tickets/:id/comments`
Lists all comments on a ticket ordered oldest-first (owner or admin).

### `POST /api/tickets/:id/comments`
Adds a comment to a ticket and emits `comment.added`.
- **Auth:** Bearer Token (owner or admin)
- **Body:**
```json
{
  "text": "Could you share a screenshot of the browser console?"
}
```
- **Response `201`:** Created comment populated with `userId` (`name`, `email`, `role`).

---

## 5. Admin Management (`/api/admin`)

All `/api/admin/*` endpoints require `role === 'admin'` (`403 Forbidden` otherwise).

### `GET /api/admin/dashboard`
Returns organization-wide statistics:
- `totalTickets`, `totalUsers`
- `byStatus`, `byPriority`, `byCategory`
- `recentActivity` (latest 20 `ActivityLog` entries)

### `GET /api/admin/tickets`
Lists all tickets across all users. Supports all query params of `GET /api/tickets` plus `userId`.

### `PUT /api/admin/tickets/:id`
Updates `status`, `priority`, and/or `assignedTo`. Emits `ticket.updated`, `status.changed` (if status changed), and `ticket.resolved` (if new status is `Resolved`).
- **Body:**
```json
{
  "status": "Resolved",
  "priority": "High",
  "assignedTo": "660f..."
}
```

### `GET /api/admin/activity`
Paginated system-wide activity logs. Optional query param `action`.

### `GET /api/admin/users`
Lists all registered users with their submitted `ticketCount`.

---

## 6. Notifications (`/api/notifications`)

### `GET /api/notifications`
Returns `{ notifications, unreadCount }` for the authenticated user. Optional `limit` param.

### `PUT /api/notifications/:id/read`
Marks a single notification as read.

### `PUT /api/notifications/read-all`
Marks all unread notifications for the authenticated user as read.
