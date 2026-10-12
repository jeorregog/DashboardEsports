# Authenticated requests: contract for all frontend modules

## Rules

1. **Always use the shared client.** Import `ApiClient` and call `ApiClient.instance`.
   Never import `axios` directly in a service, or the request will be sent without a token.

   ```ts
   import { ApiClient } from '@/services/ApiClient.js';

   const { data } = await ApiClient.instance.get<TeamInterface[]>('/api/teams');
   ```

2. **Do not set the `Authorization` header yourself.** The request interceptor adds
   `Authorization: Bearer <JWT>` to every request except `POST /api/auth/login` and
   `POST /api/auth/register`.

3. **Do not handle 401 in views or services.** The response interceptor clears the
   session and redirects to `/login?redirect=<current path>`. A 403 (non-admin writing)
   is not handled globally; show `ApiErrorParser.getMessage(error, 'fallback')`.

4. **Use `ApiErrorParser.getMessage(error, fallback)`** to turn a backend error into UI text.

5. **Never store domain data in Pinia.** `auth.store` holds session state only.

## Routes

- Every route requires login by default. Only routes with `meta.requiresAuth: false` are public.
- Admin routes must declare `meta: { requiresAuth: true, requiresAdmin: true }`.
- `AdminPlayersView` must be registered with the route **name `admin.players`** and path
  `/admin/players`. `AppNavbar` shows its link automatically once that route exists.

## Session API (`useAuthStore`)

| Member | Description |
| --- | --- |
| `isAuthenticated` | A valid, non-expired session exists |
| `isAdmin` | `currentUser.isAdmin`, taken from the JWT claim |
| `currentUser` | `{ id, username, email, isAdmin, createdAt, updatedAt }` |
| `login(dto)` / `register(dto)` | Return `true` on success; on failure they return `false` and set `error` |
| `logout()` | Clears user, token and storage |

## Backend contract in use

- `POST /api/auth/login` body `{ email, password }` -> `{ token, user }`
- `POST /api/auth/register` body `{ username, email, password }` -> `{ token, user }`
- JWT payload: `{ sub, email, isAdmin, iat, exp }`
- There is no "current user" endpoint, so the session is restored from `localStorage`
  (`auth.token`, `auth.user`) after validating the token expiry and claims.

The frontend guards are a usability layer only. Authorization is enforced by the backend guards.
