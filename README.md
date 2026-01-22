# Crypto Backend (Express + MongoDB)

APIs for the Crypto Ballot app. Uses JWT auth, MongoDB (Mongoose), and simple role-based access (admin/voter).

## Quickstart

1. Prereqs: Node 18+, MongoDB running at `mongodb://localhost:27017/crypto-ballot`.
2. Copy env: `cp .env.example .env` (or edit variables as needed).
3. Install & run:

```bash
npm install
npm run dev
```

Server: http://localhost:4000

On first boot, a default admin is seeded from env: `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

## Auth

- `POST /api/auth/login` { email, password } -> { token, user }
- `GET /api/auth/me` (Bearer token)

## Voters (admin)

- `POST /api/voters` { name, email, password }
- `GET /api/voters`

## Elections

- `POST /api/elections` (admin) { name, description, startsAt, endsAt }
- `GET /api/elections` (auth)
- `GET /api/elections/active` (auth)
- `GET /api/elections/:id` (auth)
- `POST /api/elections/:id/candidates` (admin) { name, party, manifesto }

## Voting

- `POST /api/votes` (auth) { electionId, candidateId } – one vote per election
- `GET /api/votes/my` (auth)

## Results

- `GET /api/results/:electionId` (auth) -> tallies by candidate

## Dashboard (admin)

- `GET /api/dashboard` -> { voters, elections, votes }

## Health

- `GET /api/health` -> { status: 'ok' }

## Frontend integration

In the Vite frontend, set:

```
VITE_API_URL=http://localhost:4000/api
```

Use `src/lib/api.ts` helper for fetch calls.
# crypto-ballot-backend
