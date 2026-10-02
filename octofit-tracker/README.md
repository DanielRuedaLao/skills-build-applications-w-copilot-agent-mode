# Octofit Tracker

Fitness tracking application for Mergington High School. The presentation tier uses React 19, Vite, React Router and Bootstrap; the API uses Node.js, Express 5, TypeScript and Mongoose 9 with MongoDB.

## Requirements

- Node.js 22.12 or later (Node 24 LTS recommended)
- MongoDB running locally on port `27017`

## Install and run

```sh
npm install --prefix octofit-tracker/backend
npm install --prefix octofit-tracker/frontend
```

Start the API and point it at MongoDB. Set a private `JWT_SECRET` for persistent local sessions; production requires this variable.

```sh
MONGODB_URI=mongodb://localhost:27017/octofit_db JWT_SECRET=replace-with-a-long-random-secret npm run dev --prefix octofit-tracker/backend
```

In another terminal, start the frontend:

```sh
npm run dev --prefix octofit-tracker/frontend
```

Open `http://localhost:5173`. In Codespaces, set `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` to the Codespace name so the frontend connects to the forwarded API on port `8000`.

## Demo data

Seed the local database with sample users, teams, activities, leaderboard entries, and workouts:

```sh
MONGODB_URI=mongodb://localhost:27017/octofit_db npm run seed --prefix octofit-tracker/backend
```

All three demo users use the password `Octofit2026!`:

- `ava_runs` / `ava@example.com`
- `noah_cycles` / `noah@example.com`
- `mia_swims` / `mia@example.com`

These are development credentials only. Do not use them in a deployed environment.

## Application behavior

- Register with a username, email, fitness level, and goal; sign in with username or email.
- Edit the display name, fitness level, and goal on the profile page.
- Create a team or join an existing team. Team creators are automatically members.
- Log running, walking, cycling, swimming, strength, yoga, or other activity. Each logged minute earns one point; totals update the all-time leaderboard.
- Recommended workouts match the profile goal and do not exceed the selected fitness level.
- Read routes and all write routes require a Bearer token. Passwords are bcrypt-hashed and never returned by the API. Set a strong `JWT_SECRET` outside local development.

## API overview

- Public: `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`
- Authenticated profile: `GET /api/auth/me`, `PATCH /api/auth/profile`
- Authenticated reads: `GET /api/users`, `/api/teams`, `/api/activities`, `/api/leaderboard`, `/api/workouts`, `/api/workouts/recommended`
- Authenticated writes: `POST /api/teams`, `POST /api/teams/:id/join`, `POST /api/activities`

## Checks

```sh
npm run build --prefix octofit-tracker/backend
npm run build --prefix octofit-tracker/frontend
npm run lint --prefix octofit-tracker/frontend
```
