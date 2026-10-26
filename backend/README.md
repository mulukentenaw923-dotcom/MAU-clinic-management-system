# MAU Clinic API

Express API backed by PostgreSQL. It is separate from the React demo and does not replace the browser-local demo data automatically.

## Setup

1. Install PostgreSQL and create an empty database and database user.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters. Keep `.env` private.
3. Install dependencies with `npm install` from this directory.
4. Create the schema with `npm run db:setup`.
5. Start the API with `npm run dev`. The API listens on port 4000 by default.

The health endpoint is `GET /api/health`. Set `FRONTEND_ORIGIN` to the origin serving the frontend when it differs from `http://localhost:5173`.

## Routes

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET|POST /api/patients`
- `GET /api/patients/queue` for active waiting and in-consultation patients
- `POST /api/ehr/consultations`
- `GET|POST /api/ehr/sick-leaves` (creation requires patient, diagnosis, date range, and reason)
- `PATCH /api/ehr/sick-leaves/:id` to approve or decline a pending request
- `GET|POST /api/inventory`
- `PATCH|DELETE /api/inventory/:id`

Authenticated routes require `Authorization: Bearer <accessToken>`. Registration creates a staff account; it does not accept a role from the client. Admins must assign doctor, pharmacist, or admin roles through an authorized operational process before those role-protected endpoints can be used.

This is a starting backend, not a production clinical-record system. Before storing real patient information, add operational safeguards appropriate to your jurisdiction, including verified staff onboarding, backups, audit trails, monitoring, and a reviewed deployment/security configuration.
