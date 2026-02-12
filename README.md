# PrimeTrade Task Manager

REST API with JWT auth, role-based access, and task CRUD. Express + PostgreSQL backend, React frontend.

## Tech Stack

- **Backend:** Node.js, Express, Sequelize, PostgreSQL, JWT, Pino
- **Frontend:** React (Vite), Axios, React Router
- **Infra:** Docker, Render (backend), Vercel (frontend)

## Quick Start (Docker)

```bash
cp backend/.env.example backend/.env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Swagger: http://localhost:5000/api/docs

## Quick Start (Local)

```bash
# backend
cd backend && npm install
cp .env.example .env  # edit DATABASE_URL if needed
npm run dev

# frontend (new terminal)
cd frontend && npm install
npm run dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Postgres connection string | `postgres://user:pass@localhost:5432/primetrade` |
| `JWT_SECRET` | Secret for signing tokens | `supersecretkey123` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `refreshsecretkey456` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,https://app.vercel.app` |
| `PORT` | Backend port | `5000` |
| `LOG_LEVEL` | Pino log level | `info` |
| `NODE_ENV` | Environment | `development` |

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/v1/auth/register` | ✗ | any | Register user |
| POST | `/api/v1/auth/login` | ✗ | any | Login, get tokens |
| GET | `/api/v1/users` | ✓ | admin | List all users |
| GET | `/api/v1/tasks` | ✓ | any | Get tasks (own / all for admin) |
| POST | `/api/v1/tasks` | ✓ | any | Create task |
| PUT | `/api/v1/tasks/:id` | ✓ | any | Update task (own / any for admin) |
| DELETE | `/api/v1/tasks/:id` | ✓ | any | Delete task (own / any for admin) |
| GET | `/api/health` | ✗ | any | Health check |

## Database Schema

```
Users                          Tasks
├── id (UUID, PK)              ├── id (UUID, PK)
├── name (STRING)              ├── title (STRING)
├── email (STRING, unique)     ├── description (TEXT)
├── password (STRING, hashed)  ├── status (ENUM: pending/in-progress/done)
├── role (ENUM: user/admin)    ├── userId (FK → Users.id)
├── createdAt                  ├── createdAt
└── updatedAt                  └── updatedAt
```

## Deploy

**Backend → Render:** Connect GitHub repo, set root dir to `backend`, add env vars above.
**Frontend → Vercel:** Connect GitHub repo, set root dir to `frontend`, set `VITE_API_URL` to your Render backend URL.

## Scalability Note

The backend is stateless — scale horizontally behind a load balancer. Move rate-limiter storage to Redis for multi-instance deployments. Add DB connection pooling and read replicas as traffic grows. Use message queues (Bull/BeeQueue) for async jobs. The Dockerized setup makes container orchestration (K8s, ECS) straightforward. Structured Pino logs are ready for centralized log aggregation (ELK, Datadog).
