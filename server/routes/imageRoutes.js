import express from 'express';
import {getImagesController,addImageController} from "../controllers/imageController.js"
import {uploadMiddleware} from "../utlis/multer.js"
import { attackMiddleware } from '../utlis/multer.js';
import { attachController } from '../controllers/imageController.js';
const router=express.Router();
router.post("/upload",uploadMiddleware,addImageController);
router.post("/attach",attackMiddleware,attachController);
router.get("/images/:menuId", getImagesController);

export default router;