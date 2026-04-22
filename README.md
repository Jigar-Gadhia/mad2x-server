# Mad2x Server

Mad2x Server is a high-performance TypeScript REST API for healthcare-style applications. It features robust authentication, doctor discovery, appointment booking, and comprehensive API documentation.

This project demonstrates professional backend engineering practices, including:
- **Clean Architecture**: Strict separation of concerns (Routes → Controllers → Services → Models).
- **Type Safety**: End-to-end TypeScript with Zod validation.
- **Secure Auth**: JWT access and refresh token flows with rotation.
- **Robust Testing**: Comprehensive E2E and integration test suites.
- **Production Ready**: Rate limiting, CORS, Helmet security, and graceful shutdown.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Auth**: JWT (Access + Refresh)
- **Documentation**: Swagger UI
- **Testing**: Node.js Test Runner, Supertest

## Architecture

```text
.
├── docs/                   # Frontend implementation guides
│   ├── mobile-frontend.md
│   └── web-frontend.md
├── src/                    # Backend source code
│   ├── config/             # DB, Env, Logger settings
│   ├── controllers/        # Auth, Doctor, Appointment handlers
│   ├── docs/               # Swagger/OpenAPI specifications
│   ├── middlewares/        # Auth, Error, Upload, Validation
│   ├── models/             # Mongoose (User, Doctor, Appointment)
│   ├── routes/             # API Route definitions (v1)
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Core business logic
│   ├── utils/              # API Response, Error, Token helpers
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Entry point & DB connection
├── test/                   # Comprehensive test suites
│   ├── e2e.test.ts         # Full business flow tests
│   ├── api.integration.ts  # Controller/Middleware tests
│   └── *-schema.test.ts    # Individual validation tests
└── package.json            # Scripts and dependencies
```

### 📖 Documentation
- **Interactive API Docs**: Available at `/docs` via Swagger.
- **Mobile Frontend Guide**: [docs/mobile-frontend.md](file:///Users/jiggsgadhia/Documents/mad2x-server/docs/mobile-frontend.md)
- **Web Frontend Guide**: [docs/web-frontend.md](file:///Users/jiggsgadhia/Documents/mad2x-server/docs/web-frontend.md)

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

### Required
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/mad2x`)
- `JWT_SECRET`: Secret key for signing access tokens.

### Optional (with Defaults)
- `PORT`: Server port (default: `5000`)
- `NODE_ENV`: `development` | `production` | `test`
- `JWT_EXPIRES_IN`: Access token lifespan (default: `1d`)
- `REFRESH_TOKEN_SECRET`: Secret key for refresh tokens (defaults to `JWT_SECRET`)
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token lifespan (default: `7d`)
- `CORS_ORIGIN`: Allowed origins (default: `*`)
- `ENABLE_SWAGGER`: Explicitly enable/disable Swagger (default: `true` in dev, `false` in prod)

## Features

### 🔐 Authentication
- Signup/Signin with secure password hashing.
- Token rotation (Access + Refresh).
- Password reset flow with hashed tokens (tokens returned in response in Dev mode for testing).
- Role-based authorization (User/Admin).

### 👨‍⚕️ Doctor Discovery
- Search by name, speciality, or hospital.
- Multi-criteria filtering and advanced sorting (fee, experience, etc.).
- Full pagination with metadata.

### 📅 Appointment Booking
- Real-time availability checks.
- Database-level unique constraints to prevent double bookings.
- Seamless booking and cancellation flow.

### 📁 Profile Management
- Secure profile data updates.
- Profile picture uploads via Multer.

## Getting Started

### 1. Setup Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 2. Install & Run
```bash
npm install
npm run dev
```
- **API URL**: `http://localhost:5000/api`
- **Docs**: `http://localhost:5000/docs`

## Scripts

- `npm run dev`: Starts server in watch mode.
- `npm run build`: Compiles TS to JS in `dist/`.
- `npm test`: Runs unit, integration, and E2E tests.
- `npm run test:e2e`: Runs the Comprehensive E2E test suite.
- `npm run admin:promote -- user@example.com`: Promotes a user to admin.

## Testing Strategy

- **Schema Tests**: Ensures strict validation of all request payloads.
- **Integration Tests**: Verifies middleware and controller coordination.
- **E2E Tests**: Validates full business flows (Signup → Book → Cancel) against a real database.

## Why This Project?

Built with recruiters in mind, this project showcases a "security-first" mindset, clean code principles, and operational excellence (logging, health checks, and graceful shutdowns).

---
*Developed as a premium portfolio showcase.*
