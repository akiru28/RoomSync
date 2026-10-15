<div align="center">
  <img src="public/assets/logos/logo_wm.png" alt="RoomSync logo" width="300" />
  <h1>RoomSync</h1>
  <p><strong>Room & Laboratory Reservation System</strong></p>
  <p>A centralized platform for browsing rooms, requesting reservations, viewing schedules, and managing laboratory reports at Camarines Sur Polytechnic Colleges (CSPC), College of Computer Studies.</p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 18 or later" />
    <img src="https://img.shields.io/badge/Express.js-Backend-111111?logo=express&logoColor=white" alt="Express.js backend" />
    <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" alt="MySQL database" />
    <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-E34F26?logo=html5&logoColor=white" alt="HTML CSS and JavaScript frontend" />
  </p>
</div>

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [User roles](#user-roles)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Local setup](#local-setup)
- [Database setup and updates](#database-setup-and-updates)
- [Environment variables](#environment-variables)
- [Run and test](#run-and-test)
- [Pages and access](#pages-and-access)
- [Theme behavior](#theme-behavior)
- [API overview](#api-overview)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Overview

RoomSync is a room and laboratory reservation system designed to make room availability, reservation requests, and academic-space administration easier to manage in one place. The system includes role-based access so users see features relevant to their responsibilities, while server-side authorization protects restricted operations.

> **Project context:** This repository is an academic project. Validate database migrations, security configuration, and role permissions before using it with real institutional data.

## Features

<table>
  <tr>
    <td width="50%"><strong>Room & lab directory</strong><br />Browse rooms and laboratories and check availability.</td>
    <td width="50%"><strong>Reservation workflow</strong><br />Submit requests, track status, and review reservation history.</td>
  </tr>
  <tr>
    <td><strong>Schedule & calendar</strong><br />View approved reservations and scheduled room usage.</td>
    <td><strong>Laboratory reports</strong><br />Submit issue reports and support administrative resolution.</td>
  </tr>
  <tr>
    <td><strong>Administrative tools</strong><br />Manage rooms, users, reservations, equipment, and reports where implemented.</td>
    <td><strong>Role-based access</strong><br />Restrict protected pages and API operations by user role.</td>
  </tr>
  <tr>
    <td><strong>Responsive interface</strong><br />Use the system across common desktop and mobile screen sizes.</td>
    <td><strong>Light & dark themes</strong><br />Theme preferences are intended for authenticated application pages only.</td>
  </tr>
</table>

Feature availability depends on the signed-in role and the current database schema. Confirm the current routes and permissions before presenting the system as production-ready.

## User roles

| Role | Typical access |
|---|---|
| **Student** | Browse rooms and view the approved schedule. |
| **Instructor / Faculty** | Browse rooms, submit reservations, and view own reservations. |
| **Lab Technician** | Browse rooms, view schedules, and submit or view laboratory reports. |
| **Admin** | Manage rooms, users, reservations, reports, equipment, and administrative reports. |

The server must enforce authorization. Hiding a menu item in the frontend is not a substitute for backend access checks.

## Technology stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (18 or later recommended) |
| Backend | Node.js and Express |
| Database | MySQL / MariaDB via `mysql2` |
| Frontend | HTML, CSS, and vanilla JavaScript |
| Templates | EJS, where used by the application |
| Authentication | Bearer-token authentication and JWT configuration |
| Styling | CSS custom properties and responsive layouts |

The current project does **not** use React/Vite and does not require a frontend build step.

## Project structure

```text
RoomSync/
├── .env.example
├── package.json
├── README.md
├── sql/
│   ├── lecture_room_reservation.sql
│   ├── roomsync_database_full_dump.sql
│   ├── roomsync_update_existing_database.sql
│   ├── add_laboratory_reporting.sql
│   └── add_reservation_program_section.sql
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
└── public/
    ├── pages/
    ├── components/
    ├── css/main.css
    ├── js/
    └── assets/
        └── logos/
            ├── logo.png
            ├── logo_wm.png
            └── roomsync-logo-assembly-fixed.svg
```

## Requirements

- Node.js 18+ and npm
- MySQL or MariaDB
- A database client such as phpMyAdmin or MySQL Workbench (optional, but useful for importing SQL)

## Local setup

1. **Open the project root.** Extract the repository and open a terminal in the `RoomSync` directory, where `package.json` is located.
2. **Install dependencies.**

   ```bash
   npm install
   ```

3. **Create your environment file** by copying `.env.example` to `.env`.

   Windows Command Prompt:

   ```bat
   copy .env.example .env
   ```

   PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. **Create the database** and import the appropriate SQL script. Read [Database setup and updates](#database-setup-and-updates) first.
5. **Configure `.env`** with your local database credentials and other required values.
6. **Start the application.**

   ```bash
   npm run dev
   ```

7. **Open the app** at `http://localhost:3000`, or use the port configured in `.env`. The root URL serves the public landing page. Sign in to access protected pages.

The server checks the database connection during startup. If it cannot connect, verify the database service, credentials, selected schema, and required tables before retrying.

## Database setup and updates

SQL files are stored in `sql/`. **Back up your database before importing or applying any SQL script.** Some full-dump or setup scripts may drop or recreate tables and can delete existing data.

- **For a new database:** inspect `sql/roomsync_database_full_dump.sql` and `sql/lecture_room_reservation.sql`, then choose the file that matches the schema version you intend to use. Do not import both blindly.
- **For an existing database:** inspect `sql/roomsync_update_existing_database.sql` and the relevant additive scripts before applying them.
- `sql/add_laboratory_reporting.sql` adds laboratory-reporting structures where needed.
- `sql/add_reservation_program_section.sql` updates the schema for reservation program/section fields where needed.

Before applying a migration, confirm table names, column types, indexes, and foreign keys against your current schema. Apply scripts in the order required by their comments and the database version. If no migration runner is configured, updates may need to be applied manually through phpMyAdmin or a MySQL client.

## Environment variables

Configure these values in `.env`. Never commit real credentials or production secrets.

| Variable | Purpose | Typical local value |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | HTTP port | `3000` |
| `DB_HOST` | MySQL hostname | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | Your local password |
| `DB_NAME` | Database/schema name | `lecture_room_reservation` |
| `JWT_SECRET` | Token-signing secret | Use a unique random secret, 32+ characters in production |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin, if applicable | `http://localhost:3000` |
| `SMTP_HOST` | SMTP server, if email is configured | Provider hostname |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | Provider username |
| `SMTP_PASSWORD` | SMTP password | Provider password |
| `SMTP_FROM` | Sender address | A verified sender address |
| `UPLOAD_DIR` | Upload storage directory | `./uploads` |
| `MAX_UPLOAD_BYTES` | Maximum upload size | `10485760` (10 MiB) |

For production, set `NODE_ENV=production` and provide a strong, unique `JWT_SECRET`. Never use a development fallback secret in production.

## Run and test

Available scripts from `package.json`:

```bash
npm start   # Start the server
npm run dev # Start with nodemon
npm test    # Run Node.js tests, if present
```

Health endpoint:

```http
GET http://localhost:3000/api/health
```

A successful health response confirms that the API process is responding. It does not replace testing login, role permissions, reservations, or database-backed operations.

## Pages and access

### Public pages

| Page | Path | Theme feature |
|---|---|---|
| Landing | `/` or `/index.html` | **Excluded** |
| Public home | `/home.html` | **Excluded** |
| Login / registration | `/login.html` | **Excluded** |
| About | `/about.html` | **Excluded** |

### Authenticated pages

| Page | Path | Typical access |
|---|---|---|
| Dashboard | `/dashboard.html` | Authenticated roles, subject to route rules |
| Rooms | `/rooms.html` | Permitted roles |
| Laboratories | `/labs.html` | Permitted roles |
| Calendar / schedule | `/calendar.html` | Permitted roles |
| Profile | `/profile.html` | Authenticated users |
| Reservation form | `/reservation.html` | Roles allowed to reserve |
| My reservations | `/my-reservations.html` | Permitted roles |
| Reports | `/reports.html` | Lab Technician / Admin, as configured |
| Admin console | `/admin.html` | Admin only |

Server-side routes and middleware determine whether a user may perform a protected action. Actual permissions can vary by role and current implementation.

## Theme behavior

> **Scope rule:** Light Mode and Dark Mode apply only to authenticated application pages. Public-facing pages must keep their existing design.

**Included:** Dashboard, rooms, laboratories, calendar/schedule, profile, reservations, reports, admin tools, and other authenticated role-specific pages.

**Excluded:**

- Landing page (`/` and `/index.html`)
- Public home page (`/home.html`)
- Login page (`/login.html`)
- About page (`/about.html`)

Theme implementation guidelines:

- Scope theme initialization, theme controls, and theme selectors to authenticated application pages/layouts.
- Keep public page styles independent of authenticated theme selectors and variables.
- Apply theme tokens consistently to authenticated-page backgrounds, cards, forms, tables, dropdowns, dialogs, and status badges.
- Maintain readable text/background contrast in both themes.
- Apply a saved theme before authenticated content paints to avoid a flash, without changing public pages.
- Respect `prefers-reduced-motion` for theme and page transitions.

After changing theme code, test every supported role and confirm that the landing, public home, login, and about pages remain visually unchanged.

## API overview

API routes are mounted under `/api`:

| Prefix | Purpose |
|---|---|
| `/api/health` | Health check |
| `/api/auth` | Registration, login, current session, and logout |
| `/api/users` | User profile operations |
| `/api/rooms` | Room listing, details, availability, and permitted admin actions |
| `/api/reservations` | Reservation requests, schedules, and status updates |
| `/api/admin` | Admin-only user, room, reservation, equipment, and reporting operations |
| `/api/reports` | Laboratory issue reports and report management |

Authenticated API calls use a bearer token in the `Authorization` header:

```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

For exact endpoint methods, request bodies, and response formats, review the route and controller files under `src/routes/` and `src/controllers/`. API behavior can change as development continues.

## Security notes

- Do not commit `.env`, database passwords, JWT secrets, SMTP credentials, or real user data.
- Change development/demo passwords before shared deployment.
- Use a strong, unique `JWT_SECRET` in production.
- Enforce role checks on the server; frontend navigation restrictions alone are not security controls.
- Back up the database before schema changes.
- Test each role with separate accounts before a demonstration or deployment.
- Use HTTPS in production and configure CORS to allow only trusted origins.

## Troubleshooting

<details>
  <summary><strong>The server fails at startup</strong></summary>

  - Confirm MySQL/MariaDB is running.
  - Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.
  - Confirm the intended SQL file was imported and required tables exist.
</details>

<details>
  <summary><strong>The page opens but data does not load</strong></summary>

  - Inspect browser Developer Tools for Console and Network errors.
  - Confirm the API is running and `/api/health` responds.
  - Verify that the signed-in role is permitted to access the operation.
</details>

<details>
  <summary><strong>The theme changes public pages</strong></summary>

  - Check whether theme selectors affect global elements such as `body`, `html`, or generic card classes without an authenticated-page scope.
  - Ensure public pages do not run authenticated theme initialization or render the authenticated theme toggle.
</details>

<details>
  <summary><strong>A page redirects to the dashboard</strong></summary>

  - The route may require authentication or a particular role. Check middleware and route definitions in `src/app.js` and `src/middleware/`.
</details>

---

<div align="center">
  <strong>RoomSync</strong><br />
  <sub>Room and Laboratory Reservation System · Academic Project</sub>
</div>
=======
# RoomSync — Room &amp; Laboratory Reservation System

> A centralized, role-based reservation platform for **Camarines Sur Polytechnic Colleges — College of Computer Studies**.
> Manage lecture rooms, computer laboratories, seminar halls, and auditoriums with real-time availability,
> structured approval workflows, and admin reporting.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles &amp; Permissions](#user-roles--permissions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Seed Accounts](#seed-accounts)
- [API Reference](#api-reference)
- [Reservation Workflow](#reservation-workflow)
- [Theme &amp; UI Design](#theme--ui-design)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Known Gaps &amp; Roadmap](#known-gaps--roadmap)
- [License](#license)

---

## Overview

RoomSync replaces manual coordination and spreadsheet-based room scheduling with a single,
authoritative web application. Every reservation request passes through a clear
approval pipeline, and every user — from student to administrator — sees only the
data their role is allowed to see.

The system is built as an academic / capstone project with a professional-grade
Navy + White institutional aesthetic, fully themed Light &amp; Dark modes, and a
clean 3-tier backend architecture (Routes → Controllers/Services → Repositories).

---

## Features

### Core
- **Room &amp; Lab Directory** — browse by type (lecture / lab / seminar / hall), capacity, location, and equipment.
- **Real-Time Availability** — per-room availability endpoint with conflict detection before submission.
- **Reservation Management** — faculty requests, admin review, and status-based cancellation/history.
- **Calendar View** — approved room schedule visible to authenticated roles.
- **Laboratory Reports** — Lab Tech issue submission and history, with Admin status/resolution management.
- **Equipment Inventory** — Admin-managed equipment records linked to laboratories.
- **Approval Workflow** — status transitions with state-machine guards.
- **Admin Reports &amp; CSV Export** — utilization, by-status counts, user activity, and CSV export.
- **User Management** — admin can list and remove users.

### UX
- **Light + Dark Mode** with OS-level fallback and `localStorage` persistence.
- **Responsive Layout** — tablet, mobile, and desktop breakpoints.
- **Glass Morphism Navigation** — blur + saturation backdrop on the landing header.
- **Splash Screen + Staggered Entrance Animations** with `prefers-reduced-motion` support.
- **IntersectionObserver Scroll-Reveal** on content sections.
- **Toast Notifications** for success / error / warning / info feedback.

### Security
- **Bearer Token Authentication** (token-based session, invalidated on logout).
- **Role-Based Access Control (RBAC)** via middleware + service-level guards.
- **Data-Level Scoping** — faculty can view their own requests; Admin can review all requests. Other roles use the approved-only shared schedule.
- **Model Field Sanitization** — `password` and `token` are stripped from user payloads before response.

---

## User Roles &amp; Permissions

RoomSync defines **4 roles** across a privilege ladder. Server-side enforcement happens in
both the route middleware and the reservation service layer.

| Capability | Student | Faculty (Instructor) | Lab Tech | Admin |
|---|---|---|---|---|
| Self-register an account | ✅ | — | — | — |
| Browse rooms &amp; availability | ✅ | ✅ | ✅ | ✅ |
| Submit a reservation | — | ✅ → **pending** | — | Create on behalf of faculty → **pending** |
| View own reservations | — | ✅ | — | ✅ |
| View approved schedule | ✅ | ✅ | ✅ | ✅ |
| Approve / Reject / Mark Completed | — | — | — | ✅ |
| Cancel eligible own reservation | — | ✅ | — | Admin manages status |
| Submit / view own lab reports | — | — | ✅ | View all |
| Manage report status / resolution | — | — | — | ✅ |
| Manage equipment inventory | — | — | — | ✅ |
| Create / Edit / Delete rooms | — | — | — | ✅ |
| List users / Delete users | — | — | — | ✅ |
| Run reservation reports + CSV export | — | — | — | ✅ |
| Access Admin page (`admin.html`) | — | — | — | ✅ |

> **Note:** The registration form UI always assigns `role: 'student'`. Faculty / Lab Tech / Admin
> accounts are expected to be created by an administrator (or pre-seeded).

Role constants: [src/constants/roles.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/constants/roles.js)
Role middleware: [src/middleware/roleMiddleware.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/middleware/roleMiddleware.js)
Service-layer rules: [src/services/reservationService.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/services/reservationService.js)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (≥18) |
| **Web framework** | Express 4.21 |
| **Data layer** | MySQL/MariaDB via `mysql2`, using repository pattern |
| **Validation** | Lightweight custom validators ([src/validators/](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/validators/)) |
| **Frontend** | Vanilla HTML / CSS / JavaScript — no build step |
| **CSS** | Custom design system with CSS Custom Properties, Light + Dark themes |
| **Session tokens** | HS256-signed JWTs, verified server-side and revocable through the stored user token |

---

## Project Structure

```
RoomSync - Void Syndicate/
├─ package.json
├─ .env                           # (copy .env.example)
├─ .env.example
├─ .gitignore
├─ README.md
│
├─ src/                           # ── BACKEND ──
│  ├─ app.js                      # Express app, middleware + route wiring
│  ├─ server.js                   # HTTP entrypoint (listen on PORT)
│  │
│  ├─ config/
│  │  ├─ environment.js           # .env loader + typed config object
│  │  └─ database.js              # In-memory seed data + getConnection()
│  │
│  ├─ constants/
│  │  └─ roles.js                 # ROLES, RESERVATION_STATUSES, ROOM_TYPES, limits
│  │
│  ├─ middleware/
│  │  ├─ authMiddleware.js        # Bearer token → req.user
│  │  ├─ roleMiddleware.js        # requireRole(...), requireAdmin
│  │  └─ errorMiddleware.js       # notFound, globalError handlers
│  │
│  ├─ routes/                     # Thin route mounts → controllers / services
│  │  ├─ authRoutes.js
│  │  ├─ userRoutes.js
│  │  ├─ roomRoutes.js
│  │  ├─ reservationRoutes.js
│  │  └─ adminRoutes.js           # Entire router gated with authenticate + requireAdmin
│  │
│  ├─ controllers/                # Parse → call service → format response
│  │  ├─ authController.js
│  │  ├─ userController.js
│  │  ├─ roomController.js
│  │  ├─ reservationController.js
│  │  └─ reportController.js
│  │
│  ├─ services/                   # Business rules layer
│  │  ├─ authService.js
│  │  ├─ reservationService.js    # RBAC, state-machine statuses, auto-approval
│  │  ├─ conflictService.js       # Double-booking / time-range checks
│  │  └─ notificationService.js   # Hooks for future email/in-app notifications
│  │
│  ├─ repositories/               # Data access — only DB queries / array ops here
│  │  ├─ userRepository.js
│  │  ├─ roomRepository.js
│  │  └─ reservationRepository.js
│  │
│  ├─ models/                     # Field spec + sanitize helpers
│  │  ├─ User.js
│  │  ├─ Room.js
│  │  └─ Reservation.js
│  │
│  ├─ validators/                 # Payload schemas (returns error string or null)
│  │  ├─ authValidator.js
│  │  └─ reservationValidator.js
│  │
│  └─ utils/                      # Shared pure helpers
│     ├─ response.js              # success / error / paginated response builder
│     ├─ dateUtils.js
│     └─ generateId.js
│
├─ public/                        # ── FRONTEND ──
│  ├─ pages/                      # Full HTML pages
│  │  ├─ index.html               # Landing / marketing (with splash + hero)
│  │  ├─ login.html               # Login + Student registration
│  │  ├─ dashboard.html           # Post-login home
│  │  ├─ rooms.html               # Room directory
│  │  ├─ labs.html                # Laboratory directory view
│  │  ├─ calendar.html            # Calendar view of reservations
│  │  ├─ reservation.html         # New reservation form
│  │  ├─ my-reservations.html     # Per-user reservation list
│  │  ├─ profile.html             # User profile editor
│  │  └─ admin.html               # Admin console (role-gated)
│  │
│  ├─ components/                 # Injected HTML partials
│  │  ├─ header.html
│  │  ├─ sidebar.html
│  │  ├─ footer.html
│  │  └─ modals/
│  │     └─ reserve-modal.html
│  │
│  ├─ css/
│  │  └─ main.css                 # Complete design system (tokens + components)
│  │
│  ├─ js/
│  │  ├─ main.js                  # Auth state, role helpers, toast, navigation rendering
│  │  ├─ api.js                   # Fetch wrapper (Bearer token, JSON, error format)
│  │  ├─ auth.js                  # Login / register form handlers
│  │  ├─ components.js            # HTML-partial injector (header, sidebar, footer, modals)
│  │  ├─ dashboard.js
│  │  ├─ rooms.js
│  │  ├─ reservation.js
│  │  ├─ my-reservations.js
│  │  ├─ calendar.js
│  │  └─ admin.js
│  │
│  └─ assets/
│     └─ images/                  # bg.jpg, cspc-logo.png, cspc.jpg
│
├─ database/                      # Migrations, seeds, schema (placeholder dirs)
│  ├─ migrations/
│  ├─ schema/
│  └─ seeds/
│
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
│
├─ docs/
│  ├─ api/
│  ├─ diagrams/
│  └─ testing/
│
└─ uploads/                       # User-uploaded attachments (if enabled)
```

---

## Quick Start

### Prerequisites
- Node.js **≥ 18**
- npm ≥ 9

### Step-by-step

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# Start MySQL/MariaDB and set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in .env.
# On a fresh database, import sql/roomsync_database.sql to create and seed the schema.
# WARNING: that SQL script drops existing tables before recreating them.
# For an existing compatible schema, review and apply sql/add_laboratory_reporting.sql
# to add the equipment and laboratory-report tables without dropping existing data.
# Apply sql/add_reservation_program_section.sql to an existing database before
# submitting reservations that include the required program/section.

# 3. Start the development server with auto-reload
npm run dev

# 4. Open in your browser
# → http://localhost:3000
```

When the database is available, startup logs:

```
[database] Connected to MySQL
RoomSync server listening on http://localhost:3000
```

### Production

```bash
npm start
```

---

## Seed Accounts

Import `sql/roomsync_database.sql` to add these development users:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@my.cspc.edu.ph` | `admin123` |
| Instructor | `instructor@my.cspc.edu.ph` | `prof123` |
| Student | `student@my.cspc.edu.ph` | `student123` |
| Lab Technician | `labtech@my.cspc.edu.ph` | `labtech123` |

The SQL script also adds sample rooms and reservations. Its drop statements will erase existing rows in these tables before reseeding.

> **Dev bypass (testing only):** In `NODE_ENV=development`, sending the header
> `Authorization: Bearer dev-bypass-admin-token` authenticates requests as a
> hard-coded Admin user — useful for scripts and Postman. See
> [authMiddleware.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/middleware/authMiddleware.js#L22-L31).

---

## API Reference

All API routes live under `/api`. Authenticated endpoints require:

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | `{ ok, service: "roomsync", time }` |

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/register` | — | `{ name, email, password, department? }` | Create a student account. Returns `{ user, token }`. |
| `POST` | `/login` | — | `{ email, password }` | Returns `{ user, token }`. |
| `GET` | `/me` | ✅ | — | Fetch current (sanitized) user. |
| `POST` | `/logout` | ✅ | — | Invalidate current token. |

Source: [src/routes/authRoutes.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/routes/authRoutes.js) · [src/controllers/authController.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/controllers/authController.js) · [src/services/authService.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/services/authService.js)

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/me` | ✅ | Current user's own profile. |
| `PATCH` | `/me` | ✅ | Update current user's profile. |
| `GET` | `/:id` | ✅ | Fetch own profile or any profile as Admin. |

Source: [src/routes/userRoutes.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/routes/userRoutes.js)

### Rooms (`/api/rooms`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | — | Public | List all active rooms. |
| `GET` | `/:id` | — | Public | Single room details. |
| `GET` | `/:id/availability` | — | Public | Free/busy time ranges for a room. |
| `GET` | `/:id/equipment` | ✅ | Authenticated | Equipment assigned to a room. |
| `POST` | `/` | ✅ | Admin | Create a room. |
| `PATCH` | `/:id` | ✅ | Admin | Update a room. |
| `DELETE` | `/:id` | ✅ | Admin | Delete / deactivate a room. |

### Schedule and laboratory reports

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/reservations/schedule` | ✅ | Any authenticated role | Approved room schedule only; does not disclose requester or purpose. |
| `POST` | `/api/reports` | ✅ | Lab Tech | Submit a laboratory issue report. |
| `GET` | `/api/reports` | ✅ | Lab Tech / Admin | Lab Tech sees own reports; Admin sees all reports. |
| `GET` | `/api/reports/:id` | ✅ | Lab Tech / Admin | Read own report or any report as Admin. |
| `PATCH` | `/api/reports/:id` | ✅ | Admin | Update report status and resolution notes. |
| `GET` | `/api/admin/equipment` | ✅ | Admin | List equipment, including retired records. |
| `POST` | `/api/admin/equipment` | ✅ | Admin | Add equipment to a laboratory. |
| `PATCH` | `/api/admin/equipment/:id` | ✅ | Admin | Update or retire equipment. |

Source: [src/routes/roomRoutes.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/routes/roomRoutes.js) · [src/controllers/roomController.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/controllers/roomController.js)

### Reservations (`/api/reservations`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | Faculty see their own requests; Admin sees all requests. Query params: `roomId`, `userId`, `status`, `start`, `end`, `page`, `perPage`. |
| `POST` | `/` | ✅ | Faculty creates a pending request. Body: `{ roomId, purpose, startDate, endDate, attendees, notes? }`. |
| `GET` | `/schedule` | ✅ | Any authenticated role can read approved schedule entries only. |
| `GET` | `/:id` | ✅ | Faculty may fetch their own reservation; Admin may fetch any reservation. |
| `PATCH` | `/:id/status` | ✅ | Body: `{ status }`. Admin manages statuses; an owner may cancel their own eligible request. |

Source: [src/routes/reservationRoutes.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/routes/reservationRoutes.js) · [src/controllers/reservationController.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/controllers/reservationController.js) · [src/services/reservationService.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/services/reservationService.js)

Admin reservation creation and editing are available under `/api/admin/reservations`.
Admin-created reservations are assigned to an instructor and start as `pending`.
Editing an approved reservation resets it to `pending` and clears its approval record.
Only pending or approved reservations may be edited.

### Admin (`/api/admin`) — **Admin-only router.**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | List all users. |
| `POST` | `/users` | Create an account with an assigned role. Passwords are hashed. |
| `PATCH` | `/users/:id` | Update user details, role, or password. Role/email/password changes invalidate the existing session. |
| `DELETE` | `/users/:id` | Remove a user. |
| `GET` | `/rooms` | List rooms, including unavailable rooms. |
| `GET` | `/reservations` | Full reservation list (all users). |
| `POST` | `/reservations` | Create a pending reservation on behalf of an instructor. |
| `PATCH` | `/reservations/:id` | Edit a pending or approved reservation; approved reservations return to pending. |
| `GET` | `/reports/utilization` | Room utilization aggregates. |
| `GET` | `/reports/by-status` | Reservation counts grouped by status. |
| `GET` | `/reports/user-activity` | User activity aggregates. |
| `GET` | `/reports/export.csv` | CSV download of reservation data. |

Source: [src/routes/adminRoutes.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/routes/adminRoutes.js)

### Response Format

All endpoints use the unified envelope:

```jsonc
// src/utils/response.js
{
  "success": true,
  "message": "…",
  "data":    { /* or [] or null */ }
}
```

Paginated endpoints add a `meta` object:

```json
{ "page": 1, "perPage": 20, "total": 142, "totalPages": 8 }
```

---

## Reservation Workflow

```
                       ┌──────────────┐
                       │  (created)   │
                       └──────┬───────┘
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                            │
                       │      Faculty request      │
                       └─────────────┬─────────────┘
                                     ▼
                              ┌──────────────┐
                              │   PENDING    │
                              └──────┬───────┘
                       Admin approve│      │Admin reject
                                    ▼      ▼
                         ┌──────────────┐ ┌──────────────┐
                         │   APPROVED   │ │   REJECTED   │ (terminal)
                         └──────┬───────┘ └──────────────┘
                                │
                   Admin or owner cancels
                                ▼
                         ┌──────────────┐
                         │  CANCELLED   │ (terminal)
                         └──────────────┘
                                │
                      Admin marks completed
                                ▼
                         ┌──────────────┐
                         │  COMPLETED   │ (terminal)
                         └──────────────┘
```

Transition rules are enforced in
[reservationService.updateStatus](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/services/reservationService.js#L102-L145) via the
`STATUS_TRANSITIONS` state machine.

**Conflict prevention:** Before any reservation is created,
[conflictService.checkConflict](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/services/conflictService.js)
verifies the room is free in the given time range, returning HTTP 409 with a list
of `conflicts` if there is overlap.

---

## Theme &amp; UI Design

Professional **Navy + White** institutional color system, implemented entirely via
CSS Custom Properties in [public/css/main.css](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/css/main.css).

### Design Tokens

| Token | Light Mode | Dark Mode |
|---|---|---|
| Primary | `#12355B` | `#0E2A4A` |
| Secondary | `#1D4ED8` | `#1D4ED8` |
| Accent | `#3B82F6` | `#3B82F6` |
| Background | `#F8FAFC` | `#07152B` |
| Surface | `#FFFFFF` | `#111827` |
| Border | `#E2E8F0` | `#1E293B` |
| Text | `#0F172A` | `#F1F5F9` |
| Muted | `#64748B` | `#94A3B8` |

Radius tokens: `--radius-sm: 6px; --radius: 10px; --radius-lg: 14px; --radius-xl: 20px`.
Easing curve: `cubic-bezier(.2,.8,.2,1)` (`--ease`).

Toggle via the moon/sun button in the app header. Preference is stored in
`localStorage` as `data-theme` attribute on `<html>`; first visit falls back to
`prefers-color-scheme`.

### Key Page Files

- **Landing:** [public/pages/index.html](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/pages/index.html) — splash, hero, features, CTA, footer
- **Login/Register:** [public/pages/login.html](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/pages/login.html)
- **Dashboard:** [public/pages/dashboard.html](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/pages/dashboard.html)
- **Calendar:** [public/pages/calendar.html](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/pages/calendar.html)
- **Admin Console:** [public/pages/admin.html](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/public/pages/admin.html)

---

## Environment Variables

Copy `.env.example` → `.env` and adjust as needed.

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` / `staging` / `production` |
| `PORT` | `3000` | HTTP server port |
| `JWT_SECRET` | development-only placeholder | **Required in production (at least 32 characters).** Signs HS256 access tokens. |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime. |
| `CORS_ORIGIN` | `*` | Allowed origin for CORS. |
| `DB_HOST` | `localhost` | MySQL/MariaDB host. |
| `DB_PORT` | `3306` | DB port. |
| `DB_USER` | `root` | DB user. |
| `DB_PASSWORD` | *(empty)* | DB password. |
| `DB_NAME` | `lecture_room_reservation` | DB schema name. |
| `SMTP_HOST` | `smtp.example.com` | SMTP relay host for notifications. |
| `SMTP_PORT` | `587` | SMTP port. |
| `SMTP_USER` | *(empty)* | SMTP user. |
| `SMTP_PASSWORD` | *(empty)* | SMTP password. |
| `SMTP_FROM` | `no-reply@school.edu` | "From" header for transactional emails. |
| `UPLOAD_DIR` | `./uploads` | Directory for file uploads. |
| `MAX_UPLOAD_BYTES` | `10485760` (10 MB) | Max upload size. |

Loaded in [src/config/environment.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/config/environment.js) and also directly bootstrapped in
[src/server.js](file:///C:/xampp/htdocs/Void/RoomSync%20-%20Void%20Syndicate/src/server.js) for environments without a `require('dotenv')` package.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run in production mode. |
| `npm run dev` | Run with Node's built-in `--watch` for auto-reload on code changes. |
| `npm test` | Run the Node.js unit tests. |
| `npm run migrate` | *(placeholder)* Run DB migrations (once a real DB is connected). |
| `npm run seed` | Seed the database with initial application data. |
| `npm run lint` | *(placeholder)* Lint sources with a chosen linter. |

---

## Known Gaps &amp; Roadmap

The current implementation includes signed access tokens with a production secret
requirement, owner/Admin profile access checks, role-guarded reservation operations,
and status-based cancellation instead of reservation hard deletion. Production
deployment still requires a strong, unique `JWT_SECRET`; development bypass is
available only when `NODE_ENV` is not production.

Remaining work includes applying and verifying the reporting migration against the
target database before deployment, broader API/database integration tests, a
durable audit/activity log, and optional email verification/password reset. The
existing test suite is focused unit coverage, not a complete production-readiness
suite. Do not import `sql/roomsync_database.sql` over an existing database: it drops
and recreates tables. Use the additive migration only after confirming its foreign
key column types match the target schema.

### 🟢 Nice-to-Have

- Real JWT (signed tokens) instead of opaque random-string tokens.
- Rate limiting on auth endpoints.
- Test coverage for each service + integration tests for role gating.
- Pre-commit lint + format hooks.

---

## License

MIT — Academic capstone project, Camarines Sur Polytechnic Colleges, College of Computer Studies.
>>>>>>> d727210a0516bfa64868a75374be255d532264a2
