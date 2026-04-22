# Mad2x Server

Mad2x Server is a TypeScript REST API for a healthcare-style application with authentication, doctor discovery, appointment booking, admin-managed doctor records, and interactive API docs.

This project is designed to present well in a recruiter review by showing:

- clean Express architecture
- TypeScript and Zod-based request safety
- JWT access and refresh token flows
- protected admin-only write operations
- race-safe appointment booking constraints
- request-pipeline integration tests for middleware and controllers
- production-minded middleware like rate limiting, CORS, Helmet, and request logging

## Tech Stack

- Node.js
- TypeScript
- Express 5
- MongoDB with Mongoose
- Zod
- JWT
- Multer
- Helmet
- CORS
- Morgan
- Express Rate Limit
- Swagger UI
- Supertest

## Architecture

```text
src
├── app.ts
├── config
├── constants
├── controllers
├── docs
├── middlewares
├── models
├── routes
├── schemas
├── scripts
├── services
├── types
├── utils
└── server.ts
```

### Layering

- `routes` define endpoint wiring and middleware order
- `controllers` translate HTTP requests into service calls
- `services` contain business logic and persistence decisions
- `schemas` validate input with Zod
- `models` define MongoDB documents and indexes
- `middlewares` handle auth, validation, upload, and errors

## Features

### Authentication

- user signup and signin
- access token plus refresh token rotation
- logout flow that invalidates stored refresh tokens
- forgot/reset password flow with hashed reset tokens
- role-aware JWT payloads

### Profile

- fetch current user profile
- update profile data
- upload profile picture

### Doctor Discovery

- paginated doctor listing
- search by doctor, speciality, or hospital
- filter by speciality, hospital, location, and availability
- sort by experience, reviews, patients, and consultation fee
- fetch doctor details by id

### Doctor Management

- create doctor
- update doctor
- delete doctor
- all write operations are admin-only

### Appointments

- create appointment
- list my appointments
- cancel appointment
- duplicate scheduled bookings are blocked with database-level unique indexes

### Operational Features

- health check endpoint
- Swagger UI docs
- request logging
- CORS configuration
- security headers with Helmet
- rate limiting
- graceful shutdown

## Security and Production Notes

- doctor write routes require an authenticated admin token
- refresh tokens are hashed before being stored
- reset-password tokens are hashed before being stored
- forgot-password responses never expose reset tokens in the API response
- Swagger docs are disabled by default in production unless explicitly enabled
- malformed MongoDB ids are rejected cleanly
- appointment booking enforces unique scheduled slots at the database level

## Environment Variables

Create `.env` from `.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mad2x
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
ENABLE_SWAGGER=true
```

### Variable Details

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used for access tokens
- `REFRESH_TOKEN_SECRET`: secret used for refresh tokens
- `CORS_ORIGIN`: `*` or a comma-separated list of allowed origins
- `RATE_LIMIT_WINDOW_MS`: rate-limit window in milliseconds
- `RATE_LIMIT_MAX`: max requests per IP per window
- `ENABLE_SWAGGER`: explicitly enable docs in production if needed

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Base API URL:

```text
http://localhost:5000/api
```

Docs:

```text
http://localhost:5000/docs
```

## Scripts

- `npm run dev` starts the server in watch mode
- `npm run build` builds TypeScript into `dist/`
- `npm start` runs the compiled server
- `npm start:prod` runs the compiled server with production mode
- `npm test` runs schema and integration tests
- `npm run check` runs type-checking and tests
- `npm run admin:promote -- user@example.com` promotes an existing user to admin

## Admin Bootstrap Flow

Doctor management routes are protected by admin authorization. To create the first admin:

1. Sign up a normal user through `POST /api/auth/signup`
2. Run:

```bash
npm run admin:promote -- user@example.com
```

3. Sign in again to receive a token carrying the `admin` role

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

In non-production environments, reset tokens are logged to the server console for local testing instead of being returned in the API response.

### Profile

- `GET /api/auth/profile`
- `PATCH /api/auth/profile`
- `POST /api/auth/profile/update`

### Doctors

- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors` admin only
- `PATCH /api/doctors/:id` admin only
- `DELETE /api/doctors/:id` admin only

Supported doctor query params:

- `page`
- `limit`
- `pageNumber`
- `pageSize`
- `search`
- `speciality`
- `hospital`
- `location`
- `available`
- `sortBy`
- `order`

### Appointments

- `POST /api/appointments`
- `GET /api/appointments/mine`
- `PATCH /api/appointments/:id/cancel`

### Misc

- `GET /health`
- `GET /docs`
- `GET /docs.json`

## Testing Strategy

The project includes both schema-level tests and request-level integration tests.

### Schema and Utility Tests

- pagination normalization
- doctor payload validation
- auth schema validation
- appointment schema validation
- Mongo ObjectId validation

### Integration Tests

- auth middleware rejects missing tokens
- admin guard rejects non-admin users
- admin tokens pass authorization middleware
- doctor create controller returns success payloads
- forgot-password does not leak reset tokens
- refresh returns rotated session payload
- appointment conflict errors are surfaced correctly
- Swagger registration is skipped when disabled

### Model Safety Tests

- Mongo unique indexes are declared for scheduled doctor slots
- Mongo unique indexes are declared for scheduled user slots

## Why This Project Reads Well to Recruiters

- The structure is easy to navigate and scale
- Business logic is separated from HTTP concerns
- Validation is centralized and type-safe
- Security got intentional attention rather than being added superficially
- The repository includes documentation, scripts, and tests that reflect actual operational usage

## Current Tradeoffs

- profile images are stored in MongoDB instead of object storage
- doctor admin management uses a CLI promotion flow instead of a full admin panel
- appointment slot uniqueness is based on exact timestamps, not configurable slot windows

Those tradeoffs are reasonable for a strong junior backend portfolio project and are documented clearly.
