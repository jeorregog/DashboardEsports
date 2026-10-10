# Backend

NestJS + TypeORM (better-sqlite3) API for the Esports dashboard.

## Default admin

On startup the application seeds an admin user if one does not already exist
(matched by email). Credentials come from environment variables with these
fallbacks:

| Variable         | Default               |
| ---------------- | --------------------- |
| `ADMIN_EMAIL`    | `admin@dashboard.com` |
| `ADMIN_PASSWORD` | `admin123`            |
| `ADMIN_USERNAME` | `admin`               |

The seeded password is bcrypt-hashed before it is stored.

## Authentication

Tokens are JWTs. Send them on protected requests via the `Authorization`
header:

```
Authorization: Bearer <token>
```

The signing secret is read from `JWT_SECRET` (dev fallback:
`dev-secret-change-me`). Tokens expire after one day.

### Public auth endpoints

| Method | Path                 | Body                           | Response          |
| ------ | -------------------- | ------------------------------ | ----------------- |
| POST   | `/api/auth/register` | `{ username, email, password }`| `{ token, user }` |
| POST   | `/api/auth/login`    | `{ email, password }`          | `{ token, user }` |

Registration always creates a non-admin user; any `isAdmin` value in the
request is ignored.

The `user` object in every response never contains the password. The password
hash is never returned by any endpoint.

## Permission scheme

- **Public:** `POST /api/auth/register`, `POST /api/auth/login`, and the home
  route (`GET /api`).
- **Requires login** (`JwtAuthGuard`): all GET read routes (for example the
  Players GET endpoints).
- **Requires admin** (`JwtAuthGuard` + `AdminGuard`): all write routes
  (POST/PATCH/DELETE) and the entire Users CRUD, including its GET routes.
