import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import env from "../config/env";
import logger from "../config/logger";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Mad2x Server API",
    version: "2.0.0",
    description: "TypeScript Express API for auth, doctors, profiles, and appointments.",
  },
  servers: [{ url: "/api", description: "API base path" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Doctor: {
        type: "object",
        properties: {
          id: { type: "string" },
          doctorName: { type: "string" },
          specialityName: { type: "string" },
          hospital: { type: "string" },
          about: { type: "string" },
          patients: { type: "number" },
          experience: { type: "number" },
          reviews: { type: "number" },
          consultationFee: { type: "number" },
          location: { type: "string" },
          available: { type: "boolean" },
        },
      },
      DoctorInput: {
        type: "object",
        required: ["doctorName", "specialityName", "hospital"],
        properties: {
          doctorName: { type: "string" },
          specialityName: { type: "string" },
          hospital: { type: "string" },
          about: { type: "string" },
          patients: { type: "number" },
          experience: { type: "number" },
          reviews: { type: "number" },
          consultationFee: { type: "number" },
          location: { type: "string" },
          available: { type: "boolean" },
        },
      },
      AuthTokenPair: {
        type: "object",
        properties: {
          token: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
      AppointmentInput: {
        type: "object",
        required: ["doctorId", "appointmentDate"],
        properties: {
          doctorId: { type: "string" },
          appointmentDate: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
      },
      SignupInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          mobile: { type: "string" },
          age: { type: "number" },
          address: { type: "string" },
        },
      },
      SigninInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      ForgotPasswordInput: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPasswordInput: {
        type: "object",
        required: ["password"],
        properties: {
          password: { type: "string", minLength: 6 },
        },
      },
      RefreshSessionInput: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      UpdateProfileInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          mobile: { type: "string" },
          age: { type: "number" },
          address: { type: "string" },
          profilePic: { type: "string", format: "binary" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "array", items: { type: "object" } },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Bad Request - Validation failed or invalid input",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Unauthorized: {
        description: "Unauthorized - Invalid or missing authentication token",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Forbidden: {
        description: "Forbidden - Insufficient permissions",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      NotFound: {
        description: "Not Found - Resource does not exist",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SignupInput" } } },
        },
        responses: {
          "201": { description: "User created" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "Sign in",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SigninInput" } } },
        },
        responses: {
          "200": {
            description: "Signed in",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthTokenPair" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh session",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshSessionInput" } } },
        },
        responses: {
          "200": { description: "Session refreshed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout session",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshSessionInput" } } },
        },
        responses: {
          "200": { description: "Logged out" },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotPasswordInput" } } },
        },
        responses: {
          "200": { description: "Reset email sent" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/reset-password/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using token",
        parameters: [{ name: "token", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPasswordInput" } } },
        },
        responses: {
          "200": { description: "Password reset successful" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profile fetched" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      patch: {
        tags: ["Auth"],
        summary: "Update profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/UpdateProfileInput" },
            },
          },
        },
        responses: {
          "200": { description: "Profile updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/doctors": {
      get: {
        tags: ["Doctors"],
        summary: "List doctors",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "speciality", in: "query", schema: { type: "string" } },
          { name: "hospital", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "available", in: "query", schema: { type: "boolean" } },
          { name: "sortBy", in: "query", schema: { type: "string" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: {
          "200": { description: "Doctors fetched" },
        },
      },
      post: {
        tags: ["Doctors"],
        summary: "Create doctor (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DoctorInput" } } },
        },
        responses: {
          "201": { description: "Doctor created" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/doctors/{id}": {
      get: {
        tags: ["Doctors"],
        summary: "Get doctor by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Doctor fetched",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Doctor" } } },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Doctors"],
        summary: "Update doctor (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DoctorInput" } } },
        },
        responses: {
          "200": { description: "Doctor updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
      delete: {
        tags: ["Doctors"],
        summary: "Delete doctor (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Doctor deleted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/appointments": {
      post: {
        tags: ["Appointments"],
        summary: "Book appointment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentInput" } } },
        },
        responses: {
          "201": { description: "Appointment booked" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/appointments/mine": {
      get: {
        tags: ["Appointments"],
        summary: "List my appointments",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "status", in: "query", schema: { type: "string", enum: ["scheduled", "cancelled", "completed"] } }],
        responses: {
          "200": { description: "Appointments fetched" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/appointments/{id}/cancel": {
      patch: {
        tags: ["Appointments"],
        summary: "Cancel appointment",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Appointment cancelled" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
} as const;

export const registerSwagger = (app: Express) => {
  if (!env.swaggerEnabled) {
    logger.info("Swagger docs disabled for this environment.");
    return;
  }

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get("/docs.json", (_req, res) => {
    res.status(200).json(openApiSpec);
  });
};
