import express from 'express';
import { getCourses } from '../controllers/getCourseController.js';
import { addCourse } from '../controllers/getCourseController.js';
const router=express.Router();
router.get("/courses",getCourses);
router.post("/courses", addCourse);

export default router;