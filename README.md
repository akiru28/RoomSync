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
