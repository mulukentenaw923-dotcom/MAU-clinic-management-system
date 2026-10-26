# MAU Clinic Management System

A clinic management dashboard with a React frontend and an Express/PostgreSQL backend for patient, consultation, pharmacy, and leave workflows.

## Project structure

- `src/` — React frontend
- `public/` — static assets
- `backend/src/` — Express API and PostgreSQL models

## Prerequisites

- Node.js 18+
- PostgreSQL running locally on port 5432

## Frontend

```bash
npm install
npm run dev
```

The frontend runs at http://localhost:5173.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at http://localhost:4000.

### Default local database config

The local development env is configured for PostgreSQL on `localhost:5432` with the database `mau_clinic`.

## Useful scripts

```bash
npm run build
npm run lint
cd backend && npm run db:setup
```
