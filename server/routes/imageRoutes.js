import express from 'express';
import {getImagesController,addImageController,HandleImage} from "../controllers/imageController.js"
import {uploadMiddleware} from "../utlis/multer.js"
import { attackMiddleware } from '../utlis/multer.js';
import { attachController } from '../controllers/imageController.js';
import multer from 'multer';
const router=express.Router();
router.post("/upload",uploadMiddleware,addImageController);
router.post("/attach",attackMiddleware,attachController);
router.get("/images/:menuId", getImagesController);

const upload = multer({ dest: 'images/' });

router.post('/image-handle', upload.single('image'),HandleImage);

export default router;