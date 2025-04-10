import express from 'express';
import { getContent, addContent, updateContent } from '../controllers/getContentController.js';
// import { saveContent,getContentByMenu,updateContent,uploadImage } from '../controllers/getContentController.js';
const router = express.Router();

router.get("/content/:menuId", getContent);
router.post("/content/:menuId", addContent);
router.put("/content/:menuId/:contentId", updateContent); // New route for updating content


export default router;