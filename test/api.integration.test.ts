import test, { before, beforeEach } from "node:test";
import assert from "node:assert/strict";

let authService: typeof import("../src/services/auth.service.js").authService;
let doctorService: typeof import("../src/services/doctor.service.js").doctorService;
let appointmentService: typeof import("../src/services/appointment.service.js").appointmentService;
let signToken: typeof import("../src/utils/token.js").signToken;
let registerSwagger: typeof import("../src/docs/swagger.js").registerSwagger;
let auth: typeof import("../src/middlewares/auth.middleware.js").auth;
let requireAdmin: typeof import("../src/middlewares/auth.middleware.js").requireAdmin;
let authController: typeof import("../src/controllers/auth.controller.js");
let doctorController: typeof import("../src/controllers/doctor.controller.js");
let appointmentController: typeof import("../src/controllers/appointment.controller.js");
let AppError: typeof import("../src/utils/app-error.js").AppError;

const createResponse = () => {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return res;
};

before(async () => {
  process.env.NODE_ENV = "test";
  process.env.MONGO_URI = "mongodb://localhost:27017/test";
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
  process.env.ENABLE_SWAGGER = "false";

  const modules = await Promise.all([
    import("../src/services/auth.service.js"),
    import("../src/services/doctor.service.js"),
    import("../src/services/appointment.service.js"),
    import("../src/utils/token.js"),
    import("../src/docs/swagger.js"),
    import("../src/middlewares/auth.middleware.js"),
    import("../src/controllers/auth.controller.js"),
    import("../src/controllers/doctor.controller.js"),
    import("../src/controllers/appointment.controller.js"),
    import("../src/utils/app-error.js"),
  ]);

  authService = modules[0].authService;
  doctorService = modules[1].doctorService;
  appointmentService = modules[2].appointmentService;
  signToken = modules[3].signToken;
  registerSwagger = modules[4].registerSwagger;
  auth = modules[5].auth;
  requireAdmin = modules[5].requireAdmin;
  authController = modules[6];
  doctorController = modules[7];
  appointmentController = modules[8];
  AppError = modules[9].AppError;
});

beforeEach(() => {
  authService.signup = async () => ({
    token: "access-token",
    refreshToken: "refresh-token",
    user: { id: "user-id", email: "user@example.com", profilePic: null },
  });
  authService.signin = async () => ({
    token: "access-token",
    refreshToken: "refresh-token",
    user: { id: "user-id", email: "user@example.com", profilePic: null },
  });
  authService.refreshSession = async () => ({
    token: "new-access-token",
    refreshToken: "new-refresh-token",
    user: { id: "user-id", email: "user@example.com", profilePic: null },
  });
  authService.logout = async () => undefined;
  authService.createResetToken = async () => ({});

  doctorService.createDoctor = async (payload: any) => ({ id: "doctor-id", ...payload });
  doctorService.getDoctors = async () => ({ items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } });
  doctorService.getDoctorById = async (id: string) => ({ id, doctorName: "Dr. Detail" } as never);
  doctorService.updateDoctor = async (id: string, payload: any) => ({ id, ...payload });
  doctorService.deleteDoctor = async () => undefined;

  appointmentService.createAppointment = async (_userId: string, payload: any) =>
    ({ id: "appointment-id", doctor: payload.doctorId, appointmentDate: payload.appointmentDate }) as never;
  appointmentService.getMyAppointments = async () => [];
  appointmentService.cancelAppointment = async (_userId: string, id: string) =>
    ({ id, status: "cancelled" }) as never;
});

test("auth middleware rejects missing tokens", async () => {
  const req = { headers: {} } as any;
  const error = await new Promise<unknown>((resolve) => auth(req, {} as any, resolve));
  assert.equal((error as { statusCode: number }).statusCode, 401);
});

test("requireAdmin rejects non-admin users", async () => {
  const req = { user: { id: "user-id", role: "user" } } as any;
  const error = await new Promise<unknown>((resolve) => requireAdmin(req, {} as any, resolve));
  assert.equal((error as { statusCode: number }).statusCode, 403);
});

test("auth middleware accepts valid admin tokens", async () => {
  const token = signToken({ id: "admin-id", role: "admin" });
  const req = { headers: { authorization: `Bearer ${token}` } } as any;

  await new Promise<void>((resolve, reject) =>
    auth(req, {} as any, (error?: unknown) => (error ? reject(error) : resolve()))
  );

  assert.equal(req.user.role, "admin");
});

test("doctor create controller returns created doctor payload", async () => {
  const req = {
    body: {
      doctorName: "Dr. Admin Created",
      specialityName: "Cardiology",
      hospital: "Mad2x Hospital",
    },
  } as any;
  const res = createResponse();

  await doctorController.createDoctor(req, res as any);

  assert.equal(res.statusCode, 201);
  assert.equal((res.body as any).data.doctorName, "Dr. Admin Created");
});

test("forgot password controller does not leak reset tokens in response", async () => {
  const req = { body: { email: "reset@example.com" } } as any;
  const res = createResponse();

  await authController.forgotPassword(req, res as any);

  assert.equal(res.statusCode, 200);
  assert.deepEqual((res.body as any).data, {});
});

test("refresh controller returns rotated session payload", async () => {
  const req = { body: { refreshToken: "refresh-token" } } as any;
  const res = createResponse();

  await authController.refreshSession(req, res as any);

  assert.equal(res.statusCode, 200);
  assert.equal((res.body as any).data.token, "new-access-token");
  assert.equal((res.body as any).data.refreshToken, "new-refresh-token");
});

test("appointment controller surfaces conflict errors", async () => {
  appointmentService.createAppointment = async () => {
    throw new AppError("Selected slot is no longer available.", 409);
  };

  const req = {
    user: { id: "user-id", role: "user" },
    body: {
      doctorId: "507f1f77bcf86cd799439011",
      appointmentDate: new Date(Date.now() + 60 * 60 * 1000),
    },
  } as any;

  await assert.rejects(() => appointmentController.createAppointment(req, createResponse() as any), /available/);
});

test("swagger registration is skipped when disabled", () => {
  const calls = { use: 0, get: 0 };
  const app = {
    use: () => {
      calls.use += 1;
    },
    get: () => {
      calls.get += 1;
    },
  } as any;

  registerSwagger(app);

  assert.equal(calls.use, 0);
  assert.equal(calls.get, 0);
});
