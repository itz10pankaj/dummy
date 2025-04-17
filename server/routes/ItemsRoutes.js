import express from "express"
import multer from "multer"
import { addItem, getItems,bulkUploadItems } from "../controllers/getItemsController.js"

const router = express.Router()
const upload = multer({ dest: "uploads/" });
router.get("/items/:categoryId", getItems)
router.post("/items/:categoryId", addItem)
router.post("/bulk-upload",upload.single("file"),bulkUploadItems)

export default router