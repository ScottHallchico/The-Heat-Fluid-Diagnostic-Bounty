# Transport Diagnostic MongoDB Backend

Backend service for the MongoDB part of the **Transport Phenomena Diagnostic Bounty** project.

This service owns the database design from `mongodb .pdf`:

- `users`
- `bounties`
- `submissions`
- `diagnostic_traces`
- `datasets`
- `evaluations`

The MVP API focuses on the most important flow:

1. Create/list bounties.
2. Submit a student diagnosis.
3. Store the Java engine's computed diagnostic trace separately.
4. Link the trace back to the submission for portfolio and evaluation use.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Default API URL:

```text
http://localhost:5000/api
```

## Core Endpoints

```text
GET    /api/health
POST   /api/users
GET    /api/users/:id/portfolio

POST   /api/bounties
GET    /api/bounties
GET    /api/bounties/:id

POST   /api/submissions
GET    /api/submissions/:id
GET    /api/submissions/user/:userId

POST   /api/diagnostic-traces
GET    /api/diagnostic-traces/:id

POST   /api/datasets
GET    /api/datasets

POST   /api/evaluations
GET    /api/evaluations/:id
```

## Java Engine Integration

The frontend or Node orchestrator can send a student submission to the Java compute engine, then store the returned physics/RCA result using:

```text
POST /api/diagnostic-traces
```

The trace stays separate from the submission so raw inputs, derived calculations, and diagnostic reasoning are never overwritten.

## Data Source Handling

The `datasets` collection is designed for the extra data-source requirements:

- static data: fluid constants, geometry, equipment information
- dynamic data: sensor readings and operating conditions
- derived data: Reynolds number, Nusselt number, pressure drop, friction factor
- diagnostic data: hypotheses, inferred causes, validation notes

Each dataset can store units, source type, citation, reliability, version, and conventions so the platform can show where engineering data came from.

## Seed Data

After MongoDB is running:

```bash
npm run seed
```
