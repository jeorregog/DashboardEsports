# DashboardEsports

Esports dashboard with a NestJS backend and a Vue 3 frontend. The first module is a full Player CRUD.

## Tech stack

- **Backend:** NestJS, TypeORM, SQLite (better-sqlite3)
- **Frontend:** Vue 3, Vite, Vue Router, Pinia, Axios, TailwindCSS

## Project structure

```
DashboardEsports/
  backend/    NestJS API (players module)
  frontend/   Vue 3 app
```

## Prerequisites

- Node.js (see each package.json `engines` field)
- npm

## Running the project

The backend and frontend run as two separate processes, each in its own terminal. Start the backend first so the frontend has an API to talk to.

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
