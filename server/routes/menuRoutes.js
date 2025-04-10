import express from 'express';
import { addMenu, getMenu } from '../controllers/menuController.js';

const router=express.Router();
router.get("/menu/:courseId",getMenu);
router.post("/menu/:courseId",addMenu);

export default router;