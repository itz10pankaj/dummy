import express from 'express';
import { uploadPdf,updateTemplateContent } from "../controllers/pdfControllers.js";
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/pdf-upload', uploadPdf);
router.put('/update-template', updateTemplateContent);
router.get('/images/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, '../output', req.params.imageName);
    
    // Check if file exists first
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }
    
    res.sendFile(imagePath);
  });
  
export default router;
