import express from "express"
import multer from "multer"
import { addItem, getItems,bulkUploadItems,bulkUploadItemsUsingWorker } from "../controllers/getItemsController.js"
import { DifferenceCalculater } from "../controllers/Insurance_difference_controller.js"
import { bulkUploadInsurancePremiums } from "../controllers/INS_PRE_Controoler.js"
const router = express.Router()
const upload = multer({ dest: "uploads/" });
router.get("/items/:categoryId", getItems)
router.post("/items/:categoryId", addItem)
router.post("/bulk-upload",upload.single("file"),bulkUploadItems)
router.post("/bulk-upload-insurance-premiums",upload.single("file"),bulkUploadInsurancePremiums)
router.post("/find-difference",upload.single("file"),DifferenceCalculater);
export default router