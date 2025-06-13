// import request from "supertest";
// import app from "../app.js";
// import "./setup/testSetup.mjs";
// import { encryptPayload } from "../utlis/Decryption.js";
// import { encryptID } from "../middleware/urlencrypt.js";


// describe("Menu API", () => {
//     const existingCourseId = 1;
//     const encryptedCourseId = encryptID(existingCourseId);
//     it("should get all menu items", async () => {
//         const res = await request(app).get(`/api/menu/${encryptedCourseId}`);
//         expect(res.statusCode).toBe(200);
//         expect(res.body.message).toBe("Menu fetched successfully");
//         expect(res.body.data).toBeInstanceOf(Array);
//     });
//     it("should return 400 for invalid courseId", async () => {
//         const res = await request(app).get("/api/menu/invalidCourseId123");
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toBe("Invalid Course ID");
//     });
//     it("should return 400 when courseId param is missing", async () => {
//         const res = await request(app).get("/api/menu/");
//         expect([400, 404]).toContain(res.statusCode);
//     });
// });
// describe("POST /api/menu/:courseId", () => {
//   const existingCourseId = 1; 
//   const encryptedCourseId = encryptID(existingCourseId);

//   it("should add a menu item to the course", async () => {
//     const payload = { name: "Introduction" };
//     const encryptedData = encryptPayload(payload);

//     const res = await request(app)
//       .post(`/api/menu/${encryptedCourseId}`)
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.message).toBe("Menu added successfully");
//     expect(res.body.data).toBeDefined();
//   });

//   it("should fail when encrypted data is missing", async () => {
//     const res = await request(app)
//       .post(`/api/menu/${encryptedCourseId}`)
//       .send({});

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Encrypted data is required");
//   });

//   it("should fail when menu name is missing in payload", async () => {
//     const encryptedData = encryptPayload({ name: "" });
//     const res = await request(app)
//       .post(`/api/menu/${encryptedCourseId}`)
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Menu name is required");
//   });

//   it("should fail when course doesn't exist", async () => {
//     const nonExistingCourseId = 9999;
//     const encryptedFakeId = encryptID(nonExistingCourseId);
//     const payload = { name: "Dummy Menu" };
//     const encryptedData = encryptPayload(payload);

//     const res = await request(app)
//       .post(`/api/menu/${encryptedFakeId}`)
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(404);
//     expect(res.body.message).toBe("Course not found");
//   });

//   it("should fail on invalid courseId", async () => {
//     const payload = { name: "Invalid ID Test" };
//     const encryptedData = encryptPayload(payload);

//     const res = await request(app)
//       .post("/api/menu/invalidEncryptedId")
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Course ID missing");
//   });
// });