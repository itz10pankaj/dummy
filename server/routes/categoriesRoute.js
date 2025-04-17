import express from 'express';
import { getCategories } from '../controllers/getCategories.js';
import { addCategory } from '../controllers/getCategories.js';
const router = express.Router();
router.get("/categories", getCategories);
router.post("/categories", addCategory);

export default router;