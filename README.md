# DashboardEsports

Esports management dashboard with a NestJS backend and a Vue 3 single-page
frontend. It covers four domain modules (Players, Teams, Matches and Users),
JWT authentication with an admin role, filterable tables and Chart.js
visualizations.

## Tech stack

- **Backend:** NestJS, TypeORM, SQLite (better-sqlite3), JWT (Passport), bcrypt
- **Frontend:** Vue 3, Vite, Vue Router, Pinia, Axios, TailwindCSS, Chart.js
- **Deployment:** Docker + Docker Compose (multi-stage builds)

## Features

- Four CRUD modules: Players, Teams, Matches, Users.
- Real authentication: login/register return a JWT; protected routes require a
  valid token and write operations require an admin user.
- Admin-only pages (Admin Players, Admin Users) guarded in the router.
- Two data pages (Teams, Matches) with a reusable filter select, a reusable
  data table and a reusable Chart.js panel.
- Reusable components: `DataTable`, `FilterSelect`, `ChartPanel`, `AppNavbar`.

## Project structure

```
DashboardEsports/
  backend/            NestJS API (auth, players, teams, matches, users, seed, home)
  frontend/           Vue 3 app
  docker-compose.yml  Full-stack deployment (backend + frontend)
```

## Main route

The application entry point is the Home page at `/`. Visiting any protected
route while logged out redirects to `/login`.

## Default admin

On first start the backend seeds an admin user (see `backend/README.md` for
details and the auth contract):

- Email: `admin@dashboard.com`
- Password: `admin123`

## Prerequisites

- Node.js (see each `package.json` `engines` field)
- npm

## Running locally (two processes)

The backend and frontend run as two separate processes, each in its own
terminal. Start the backend first so the frontend has an API to talk to.

### 1. Backend (API)

```powershell
cd backend
npm install        # first time only
npm run start:dev  # development mode with auto-reload
```

- API runs at `http://localhost:3000`.
- All routes are under the `/api` prefix (for example `http://localhost:3000/api/players`).
- A `database.sqlite` file is created automatically on first start.

### 2. Frontend (web app)

In a second terminal:

```powershell
cd frontend
npm install   # first time only
npm run dev   # Vite dev server
```

- App runs at `http://localhost:5173`.
- The API base URL is configured in `frontend/.env` (`VITE_API_BASE_URL=http://localhost:3000`).
- CORS on the backend already allows `http://localhost:5173`.

Stop either process with `Ctrl+C` in its terminal.

## Build / verification (no servers)

- Backend: `npm run build`
- Frontend: `npm run type-check` and `npm run build-only`

## Deployment (Docker Compose)

The project ships multi-stage Dockerfiles for both apps and a `docker-compose.yml`
that builds and runs them together. The backend persists its SQLite database in
a named volume so data survives container restarts.

Before deploying, replace `__VM_IP__` in `docker-compose.yml` with the public IP
or host of the target machine (it appears in the backend `CORS_ORIGIN` and in the
frontend `VITE_API_BASE_URL` build arg), then:

```bash
docker compose up -d --build
```

- Frontend is served by nginx on port `80`.
- Backend listens on port `3000`.

The frontend bakes `VITE_API_BASE_URL` at build time, so changing the target
host requires a rebuild (`--build`).
