import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app.js";

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let doctorId: string;
let appointmentId: string;

before(async () => {
  const uri = "mongodb://localhost:27017/mad2x_test";
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("Comprehensive E2E Test Suite", async (t) => {
  await t.test("Auth Flow: Signup", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.data.token);
    userToken = res.body.data.token;
  });

  await t.test("Auth Flow: Signin", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "password123",
      });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.token);
  });

  await t.test("Auth Flow: Update Profile", async () => {
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Updated Test User",
        mobile: "1234567890",
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.name, "Updated Test User");
  });

  let refreshToken: string;
  await t.test("Auth Flow: Refresh Session", async () => {
    // Get refresh token from signin
    const signinRes = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "password123",
      });
    refreshToken = signinRes.body.data.refreshToken;

    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.data.token);
    userToken = res.body.data.token; // Update user token for subsequent tests
  });

  await t.test("Auth Flow: Logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken });
    assert.strictEqual(res.status, 200);
  });

  await t.test("Admin Flow: Promote and Create Doctor", async () => {
    await mongoose.connection.db?.collection("users").updateOne(
      { email: "test@example.com" },
      { $set: { role: "admin" } }
    );

    const signinRes = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "password123",
      });
    adminToken = signinRes.body.data.token;

    const res = await request(app)
      .post("/api/doctors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        doctorName: "Dr. E2E",
        specialityName: "Testing",
        hospital: "Test Hospital",
        consultationFee: 500,
      });
    assert.strictEqual(res.status, 201);
    doctorId = res.body.data.id;
  });

  await t.test("Doctor Flow: List and Detail", async () => {
    const listRes = await request(app).get("/api/doctors");
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.body.data.items.length > 0);

    const detailRes = await request(app).get(`/api/doctors/${doctorId}`);
    assert.strictEqual(detailRes.status, 200);
    assert.strictEqual(detailRes.body.data.doctorName, "Dr. E2E");
  });

  await t.test("Appointment Flow: Book, List, Cancel", async () => {
    const bookRes = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        doctorId,
        appointmentDate: new Date(Date.now() + 86400000).toISOString(),
      });
    assert.strictEqual(bookRes.status, 201);
    appointmentId = bookRes.body.data.id;

    const listRes = await request(app)
      .get("/api/appointments/mine")
      .set("Authorization", `Bearer ${userToken}`);
    assert.strictEqual(listRes.status, 200);

    const cancelRes = await request(app)
      .patch(`/api/appointments/${appointmentId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);
    assert.strictEqual(cancelRes.status, 200);
  });

  await t.test("Password Reset Flow: Forgot and Reset", async () => {
    const forgotRes = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });
    assert.strictEqual(forgotRes.status, 200);
    const resetToken = forgotRes.body.data.resetToken;
    assert.ok(resetToken);

    const resetRes = await request(app)
      .post(`/api/auth/reset-password/${resetToken}`)
      .send({ password: "newpassword123" });
    assert.strictEqual(resetRes.status, 200);

    const loginRes = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "test@example.com",
        password: "newpassword123",
      });
    assert.strictEqual(loginRes.status, 200);
  });
});
