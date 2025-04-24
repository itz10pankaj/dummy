import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { responseHandler } from '../utlis/responseHandler.js';
import { AppDataSource } from '../config/data-source.js';
import { Template } from '../models/Template.js';

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
export const uploadPdf = async (req, res) => {
    try {
        if (!req.files || !req.files.pdf) {
            return responseHandler.badRequest(res, "No PDF file uploaded");
        }
        const pdfFile = req.files.pdf;
        const data = await pdfParse(pdfFile.data);
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const outputDir = path.join(process.cwd(), 'output');

        
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        const pdfPath = path.join(uploadsDir, pdfFile.name);
        fs.writeFileSync(pdfPath, pdfFile.data);

        const htmlFileBase = pdfFile.name.replace(/\.pdf$/, '');
        const htmlFilePath = path.join(outputDir, `${htmlFileBase}.html`);

        exec(`pdftohtml -s -noframes "${pdfPath}" "${htmlFilePath}"`, async (err, stdout, stderr) => {
            if (err) {
                console.error('pdftohtml error:', stderr);
                return responseHandler.error(res, err, "Failed to convert PDF to HTML", 500);
            }
            let htmlContent = "";
            try {
                htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
            } catch (readErr) {
                console.error("Error reading HTML file:", readErr);
            }

            const templateRepo = AppDataSource.getRepository(Template);
            const newTemplate = templateRepo.create({
                name: pdfFile.name,
                content: data.text,
                fileName: pdfFile.name,
                htmlContent: htmlContent,
            });
            await templateRepo.save(newTemplate);
            return responseHandler.success(
                res,
                newTemplate,
                "PDF uploaded and content saved successfull",
                200
            );
        });
        } catch (error) {
            console.error("PDF Parse Error:", error);
            return responseHandler.error(res, error, "Failed to parse PDF");
        }
    };


    export const updateTemplateContent = async (req, res) => {
        try {
            const { templateId, newContent,newHtmlContent  } = req.body;
            const templateRepo = AppDataSource.getRepository(Template);
            const template = await templateRepo.findOne({ where: { id: templateId } });

            if (!template) {
                return responseHandler.badRequest(res, "Template not found", 400);
            }
            template.content = newContent;
            template.htmlContent = newHtmlContent;
            await templateRepo.save(template);

            return responseHandler.success(
                res,
                template,
                "Template content updated successfully",
                200
            );
        } catch (error) {
            console.error("Update Template Error:", error);
            return responseHandler.error(res, error, "Failed to update template content", 500);
        }
    }