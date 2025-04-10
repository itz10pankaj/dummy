import express from 'express'
import { getLocations } from '../controllers/getLocationsController.js';

const router = express.Router()
router.get('/locations', getLocations)

export default router