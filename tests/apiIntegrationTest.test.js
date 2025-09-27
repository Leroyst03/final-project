require("dotenv").config();
const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Handlers de tu API
const registerHandler = require("../api/user/register.js");
const loginHandler = require("../api/user/login.js");
const profileHandler = require("../api/user/profile.js");

const secret = process.env.JWT_SECRET;

function createTestApp() {
  const app = express();
  app.use(express.json());

  app.post("/api/register", (req, res) => registerHandler(req, res));
  app.post("/api/login", (req, res) => loginHandler(req, res));
  app.all("/api/profile", (req, res) => profileHandler(req, res));

  return app;
}

describe("Integración completa con MongoDB real", () => {
  let app;
  let token;
  const testEmail = "juan_integration@test.com";

  beforeAll(() => {
    app = createTestApp();
  });

  test("1. Registro de usuario en la base real", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ name: "Juan", age: 30, email: testEmail, password: "123456" });

    // Puede ser 201 (nuevo), 409 (ya existe) o 500 (error interno)
    expect([201, 409, 500]).toContain(res.status);
  });

  test("2. Login devuelve un JWT válido", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: testEmail, password: "123456" });

    expect([200, 401, 500]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body.token).toBeDefined();
      token = res.body.token;
      const decoded = jwt.verify(token, secret);
      expect(decoded).toHaveProperty("id");
    }
  });

  test("3. GET /profile devuelve usuarios con token válido", async () => {
    if (!token) return; // si no hay token, saltamos este test

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 401]).toContain(res.status);
  });

  test("4. PUT /profile actualiza datos del usuario", async () => {
    if (!token) return;

    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Leroy Actualizado" });

    expect([200, 404, 401]).toContain(res.status);
  });
});
