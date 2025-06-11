import request from "supertest";
import app from "../app.js";
import { initializeServer } from "../server.js";
import { encryptPayload } from "../utlis/Decryption.js";
beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initializeServer(); 
});



describe("Course API", () => {
  it("should get all courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Menu API", () => {
  it("should get all menu items", async () => {
    const res = await request(app).get("/api/menu/U2FsdGVkX18-k1AkffE4xhU0JzN2Pn5atvifXkF4Kfc");
    expect(res.statusCode).toEqual(200);
  });
});


describe("POST /auth/login", () => {
  it("should login user with valid credentials", async () => {
    const payload = {
      email: "pgarg9355@gmail.com",
      password: "paPR1002@",
      latitude: 28.6,
      longitude: 77.2,
    };

    const encryptedData = encryptPayload(payload);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ encryptedData });

    expect(res.statusCode).toBe(200);
    expect(res.body.Status).toBe("Success");
    expect(res.body.user).toHaveProperty("email", "pgarg9355@gmail.com");
  });

  it("should fail with invalid credentials", async () => {
    const payload = {
      email: "pgarg9355@gmail.com",
      password: "wrongpass",
      latitude: 0,
      longitude: 0,
    };

    const encryptedData = encryptPayload(payload);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ encryptedData });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized access");
  });

  it("should fail for unknown user", async () => {
    const payload = {
      email: "doesnotexist@example.com",
      password: "anything",
      latitude: 0,
      longitude: 0,
    };

    const encryptedData = encryptPayload(payload);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ encryptedData });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});


describe("POST /auth/register", () => {
  it("should fail if user already exists", async () => {
    const payload = {
      name: "Pankaj",
      email: "pgarg9355@gmail.com",
      password: "test123",
      latitude: 0,
      longitude: 0,
    };
    // Second registration with same email - should fail
    const res = await request(app)
      .post("/api/auth/register")
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });

});


