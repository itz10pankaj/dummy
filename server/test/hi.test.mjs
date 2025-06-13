import { getMenu ,getMenusByCourseId} from '../controllers/menuController.js';
import { AppDataSource } from '../config/data-source.js';
import { redisClient } from '../config/redis-client.js';
import { encryptID } from "../middleware/urlencrypt.js";
import { Menu } from "../models/Menu.js";
import { Course } from "../models/Courses.js";
import { jest } from '@jest/globals';
import * as menuHelpers from '../controllers/menuController.js';
describe('getMenu - Integration Tests', () => {
  beforeAll(async () => {
    // Initialize database connection
    await AppDataSource.initialize();

  });

  afterAll(async () => {
    // Close connection
    await AppDataSource.destroy();
  });


  it('should retrieve menu items  ', async () => {
    //  const spy = jest.spyOn(menuHelpers, 'getMenusByCourseId');
    const courseId = 1;
    const encryptedCourseId = encryptID(courseId);
    const req = { params: { courseId: encryptedCourseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await getMenu(req, res);
      // expect(spy).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Menu fetched successfully",
      status: "success",
      data: expect.anything()
    }));
      // spy.mockRestore(); // cleanup

  });
  it('should NOT menu items  ', async () => {
    const courseId = 157;
    const encryptedCourseId = encryptID(courseId);
    const req = { params: { courseId: encryptedCourseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await getMenu(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Course not found",
      status: "error"
    }));
  });
  it('COUSRE ID NOT PASSED ', async () => {
    const courseId = 157;
    const encryptedCourseId = encryptID(courseId);
    const req = { params: { courseId: "" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await getMenu(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Course ID is required",
      status: "error"
    }));
  });
});


describe("getMenusByCourseId - Using Existing DB Data", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should fetch menus linked to an existing course from DB", async () => {
    const knownCourseId = 1; // 👈 Use a real existing course ID in your DB

    const menus = await getMenusByCourseId(knownCourseId);

    expect(Array.isArray(menus)).toBe(true);

    if (menus.length > 0) {
       expect(menus[0]).toHaveProperty("name");
      expect(menus[0]).toHaveProperty("course");
      expect(menus[0].course).toHaveProperty("id", knownCourseId);
    } else {
      console.warn("⚠️ No menus found. Make sure courseId exists and has related menus.");
    }
  });
});
describe("getMenusByCourseId - Using Non-Existing Course ID", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should return an empty array for a non-existing course ID", async () => {
    const nonExistingCourseId = 9999; // 👈 Use a course ID that does not exist in your DB

    const menus = await getMenusByCourseId(nonExistingCourseId);

    expect(Array.isArray(menus)).toBe(true);
    expect(menus.length).toBe(0);
  });
});