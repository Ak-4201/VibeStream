# VibeStream (Netflix-style movie app with auth)

Netflix-inspired landing page built with **React + Vite** (OMDb for movies) and **Spring Boot** (auth). After sign-in, the dashboard shows the same movie content as [vibe-stream-seven.vercel.app](https://vibe-stream-seven.vercel.app).

## Frontend (React)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Optional: create a `.env` file (see `.env.example`):

- `VITE_OMDB_API_KEY` – OMDb API key (default provided).
- `VITE_AUTH_API_URL` – Backend auth API URL (default: `http://localhost:8080`).

3. Run the app:

```bash
npm run dev
```

### Auth flows

- **Sign In** (`/login`): username or email + password. “New to Kodflix? Sign up now.” links to signup.
- **Sign Up** (`/signup`): User ID, user name, email, phone, create password, confirm password. Client-side validation (email format, min 8-char password, matching passwords). On success, JWT is stored in `localStorage` and user is redirected to the home (movie) dashboard.
- **Protected routes**: `/` (movie browsing) requires login; unauthenticated users are redirected to `/login`.
- **Navbar**: When logged out, “Sign In” and “Sign Up” on the top right. When logged in, username, avatar, and “Sign out”.

## Backend (Spring Boot + Aiven MySQL)

See **[backend/README.md](backend/README.md)** for:

- Aiven MySQL connection (add your backend/server IP to the service **allowlist** in Aiven console).
- Env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`.
- Endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` (JWT in `Authorization: Bearer <token>`).
- Passwords stored as **BCrypt** hashes; duplicate emails prevented; role `ROLE_USER`; CORS configured for the frontend origin.

Quick run (from project root):

```bash
cd backend
# Set env vars (Aiven URL, password, JWT_SECRET), then:
./mvnw spring-boot:run
```

## Tests

```bash
npm run test:run
```

## Verify

- **Movies**: DevTools → Network → filter `omdbapi` for movie requests.
- **Auth**: Sign up, then sign in; navbar shows username and Sign out; visiting `/` shows the movie dashboard.

