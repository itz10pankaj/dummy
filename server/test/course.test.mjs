// import request from "supertest";
// import app from "../app.js";
// import "./setup/testSetup.mjs";
// import { encryptPayload } from "../utlis/Decryption.js";

// describe("Course API", () => {
//   it("should get all courses", async () => {
//     const res = await request(app).get("/api/courses");
//     expect(res.statusCode).toEqual(200);
//   });

//    it("should add a new course successfully", async () => {
//     const payload = {
//       name: "NodeJS"
//     };

//     const encryptedData = encryptPayload(payload);

//     const res = await request(app)
//       .post("/api/courses")
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.message).toBe("Course added successfully");
//     expect(res.body.data).toBeDefined();
//   });

//   it("should fail when course already exists", async () => {
//     const payload = {
//       name: "HTML" // Assuming it was added in previous test
//     };

//     const encryptedData = encryptPayload(payload);

//     const res = await request(app)
//       .post("/api/courses")
//       .send({ data: encryptedData });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Course already exists");
//   });

//   it("should fail when no data is sent", async () => {
//     const res = await request(app).post("/api/courses").send({});
//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toBe("Course name is required");
//   });


// });