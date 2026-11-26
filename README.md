# HelpDesk Pro — Support Ticket Management System

A full-stack **Support Ticket Management System (Mini Helpdesk)** built with **Node.js**, **Express.js**, **MongoDB**, and **React.js (Vite + Tailwind CSS)**. Users can submit and track support tickets, collaborate via comments, and receive real-time in-app notifications, while administrators can triage tickets, update statuses/priorities, inspect event-driven activity logs, and monitor system analytics.

---

## Key Features

### Core Functional Requirements
- **Authentication & Role-Based Access Control (RBAC)**
  - User registration and login secured with **JWT** (`24h` expiry) and **bcryptjs** password hashing.
  - Two distinct roles: `user` and `admin`. Registration strictly assigns `user` role to prevent privilege escalation.
  - Route-level and resource-level ownership enforcement.
- **User Ticket Management**
  - Create support tickets with `title`, `description`, `category` (`General`, `Bug`, `Feature`, `Account`), and `priority` (`Low`, `Medium`, `High`, `Urgent`).
  - View personal ticket dashboard statistics (`GET /api/tickets/stats`) and paginated ticket list.
  - Edit or delete personal tickets when in editable states (`Open` / `In Progress`); `Resolved` and `Closed` tickets are locked against user edits/deletion.
  - Track ticket status (`Open`, `In Progress`, `Resolved`, `Closed`) and full audit history.
- **Admin Management**
  - View all tickets submitted across all users with search, sorting, and filtering by `status`, `priority`, `category`, and `userId`.
  - Update ticket `status`, `priority`, and `assignedTo` from both the admin list and ticket detail views.
  - Admin Command Center dashboard with KPI metrics, status/priority/category breakdowns, and live activity feed.
- **Threaded Comments**
  - Ticket owners and administrators can exchange comments on tickets (`GET/POST /api/tickets/:id/comments`).
  - Admin replies are badged in the UI as **Support Admin**.
- **Event-Driven Workflow (`EventEmitter`)**
  - Centralized `EventService` (`backend/services/eventService.js`) emits domain events:
    - `ticket.created`
    - `ticket.updated`
    - `status.changed`
    - `comment.added`
    - `ticket.resolved`
    - `ticket.deleted`
  - Listeners asynchronously record audit trails into MongoDB (`ActivityLog`), generate persistent in-app `Notification` records for affected users/admins, and optionally send SMTP emails via Nodemailer (`backend/services/emailService.js`).

### Bonus Features Implemented
- Search (regex-escaped across `title` and `description`), multi-field filtering, sorting (`sortBy`, `sortOrder`), and pagination.
- User & Admin dashboards with ticket statistics.
- In-app notifications bell with unread counter and mark-as-read controls (`/api/notifications`).
- Optional SMTP email notification support via `nodemailer`.
- Automated backend integration test suite (`Jest` + `Supertest` + `mongodb-memory-server`).
- Responsive React UI with Tailwind CSS, confirmation modals, inline validation, and toast notifications.
- Full Docker & Docker Compose support + Render / Vercel deployment configs + GitHub Actions CI.

---

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | Node.js 20, Express.js, Mongoose ODM, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `express-validator`, `helmet`, `cors`, `express-rate-limit`, `morgan`, `nodemailer` |
| **Database** | MongoDB (with `mongodb-memory-server` optional fallback for local dev/testing) |
| **Frontend** | React 19, Vite, React Router v7, Axios, Tailwind CSS v3, Lucide React, React Hot Toast |
| **Testing & Tooling** | Jest, Supertest, `mongodb-memory-server`, Oxlint |
| **Deployment** | Docker, Docker Compose, Nginx, GitHub Actions CI, Render (`render.yaml`), Vercel (`vercel.json`) |

---

## Project Structure

```text
support-ticket-system/
├── .github/workflows/ci.yml        # Automated CI for backend tests & frontend build/lint
├── docker-compose.yml              # Multi-container setup (MongoDB + Backend + Nginx Frontend)
├── render.yaml                     # Render Blueprint for cloud deployment
├── README.md
├── docs/
│   ├── API.md                      # REST API documentation
│   ├── DATABASE_DESIGN.md          # MongoDB schema & ER design explanation
│   └── postman_collection.json     # Ready-to-import Postman collection
├── backend/
│   ├── config/                     # Environment config & MongoDB connection
│   ├── controllers/                # Route handlers (auth, tickets, comments, admin, notifications)
│   ├── middleware/                 # JWT auth, role guard, express-validator rules, error handler
│   ├── models/                     # User, Ticket, Comment, ActivityLog, Notification schemas
│   ├── routes/                     # Express routers
│   ├── services/                   # EventEmitter workflow & email notification service
│   ├── tests/                      # Jest + Supertest integration tests
│   ├── utils/                      # ApiResponse wrapper, query builder, seeder
│   ├── Dockerfile
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/             # Auth, Layout, Tickets, Comments, Admin, Common UI components
    │   ├── context/                # AuthContext provider
    │   ├── hooks/                  # useAuth, useTickets
    │   ├── pages/                  # 10 application pages
    │   ├── services/               # Axios API client & service modules
    │   └── utils/                  # Constants & helpers
    ├── Dockerfile
    ├── nginx.conf
    ├── vercel.json
    └── vite.config.js
```

---

## Local Setup Instructions

### Prerequisites
- **Node.js** >= 20.x and **npm**
- **MongoDB** (local instance or MongoDB Atlas URI). *Note: For instant local testing without installing MongoDB, set `USE_MEMORY_DB=true` in `backend/.env` (enabled by default for local dev).*

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Edit `backend/.env` as needed:
- Set `MONGODB_URI` to your MongoDB instance (or set `USE_MEMORY_DB=true` in development to auto-boot and auto-seed an in-memory MongoDB).
- Set a strong `JWT_SECRET`.

Seed a real MongoDB database manually (when `USE_MEMORY_DB=false`):
```bash
npm run seed
```

Start the backend API server (runs on `http://localhost:5000`):
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The frontend dev server runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

### Demo Credentials (Seeded)
| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@helpdesk.com` | `admin123` |
| **User** | `user@helpdesk.com` | `user123` |

---

## Running Automated Tests & Quality Checks

### Backend Integration Tests
```bash
cd backend
npm test
```

### Frontend Lint & Production Build
```bash
cd frontend
npm run lint
npm run build
```

---

## Running with Docker

```bash
docker compose up --build
```
- **Frontend (Nginx):** `http://localhost:3000`
- **Backend API:** `http://localhost:5000/api/health`
- **MongoDB:** `localhost:27017`

---

## Cloud Deployment Guide (Render + Vercel + MongoDB Atlas)

1. **Database (MongoDB Atlas)**:
   - Create a free M0 cluster on MongoDB Atlas, create a DB user, allow network access (`0.0.0.0/0` for PaaS or specific egress IPs), and copy the connection string (`MONGODB_URI`).
2. **Backend (Render)**:
   - Push this repository to GitHub.
   - Create a new Web Service on Render (or use `render.yaml` Blueprint) with Root Directory `backend`.
   - Build Command: `npm install --omit=dev` | Start Command: `node server.js`.
   - Set environment variables: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`.
   - Seed production data once via Render Shell: `node seed.js`.
3. **Frontend (Vercel or Render Static Site)**:
   - Import the repo into Vercel with Root Directory `frontend` (SPA routing is pre-configured in `frontend/vercel.json`).
   - Set environment variable `VITE_API_URL=https://<your-render-backend>.onrender.com/api`.
   - Deploy!

---

## Key Architectural & Implementation Decisions

1. **Decoupled Event-Driven Workflow**: Rather than mixing audit logging and notifications directly into controllers, controllers emit semantic domain events on a singleton Node.js `EventEmitter` (`EventService`). Listeners handle `ActivityLog` persistence, `Notification` creation, and email dispatch asynchronously without coupling or duplicating side effects across endpoints.
2. **Defense-in-Depth RBAC & State Guards**: Role checks (`authorize('admin')`) are enforced at the router level, while ticket ownership and lifecycle guards (e.g., preventing non-admins from mutating `status` directly or deleting `Resolved`/`Closed` tickets) are enforced inside controllers.
3. **Shared Query Builder**: Search, filter, sort, and pagination logic is centralized in `backend/utils/ticketQuery.js` (with regex metacharacter escaping) so both user and admin endpoints behave consistently without code duplication.
4. **Standardized API Envelopes**: Every endpoint returns a predictable `{ success, message, data, pagination?, errors? }` structure via `ApiResponse`, simplifying frontend Axios handling and error messaging.
