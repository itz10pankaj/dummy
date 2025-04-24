import express from 'express';
import { getUserLogs,addUserLog } from '../controllers/logsController.js';

const router=express.Router();
router.post("/add", addUserLog);

// POST: Get logs of specific user by userId (sent in req.body)
router.post("/get", getUserLogs);

export default router;