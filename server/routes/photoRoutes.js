import express from 'express'
import { addPhotoMiddleware } from '../utlis/multer.js'
import {getPhotosController,addPhotoController} from "../controllers/photosController.js"

const router=express.Router();
router.post("/photoUpload",addPhotoMiddleware,addPhotoController)
router.get("/photos/:itemId", getPhotosController);

export default router;