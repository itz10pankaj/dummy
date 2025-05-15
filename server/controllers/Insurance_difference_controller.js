import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/data-source.js";
import { InsuranceInsurer } from "../models/Insurer.js";
import { InsurancePartner } from "../models/partner.js";
import { InsurancePartnerInsurerMapping } from "../models/partner_insuruer_mapping.js";
import { createObjectCsvWriter } from "csv-writer";
import os from "os";

export const DifferenceCalculater = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }
  
      const filePath = path.resolve(req.file.path);
      const results = [];
      const output=[];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) =>
         results.push(row))
        .on("end", async () => {
          for (const row of results) {
            const partnerName = row["Partner"].trim();
            const insurerName = row["Insurer"].trim();
            const csvAdminFeeIO = parseInt(row["Admin Fee (Fixed): Insurer to OTO"]);
            const csvAdminFeeOT = parseInt(row["Admin Fee (Fixed): OTO To Agent/Customer"]);
            // 1. Get partner_id
            const partner = await AppDataSource.getRepository(InsurancePartner).findOneBy({ name: partnerName });
            if (!partner) {
              console.log(`Partner "${partnerName}" not found.`);
              continue;
            }
  
            // 2. Get insurer_id
            const insurer = await AppDataSource.getRepository(InsuranceInsurer).findOneBy({ name: insurerName });
            if (!insurer) {
              console.log(`Insurer "${insurerName}" not found.`);
              continue;
            }
            const mapping = await AppDataSource.getRepository(InsurancePartnerInsurerMapping)
              .findOneBy({ partner_id: partner.id, insurer_id: insurer.id });
  
            if (!mapping) {
              console.log(`Mapping not found for ${partnerName} & ${insurerName}`);
              continue;
            }
            const dbAdminFee = mapping.admin_fee;
            const diffIO = csvAdminFeeIO - dbAdminFee;
            const diffOT = csvAdminFeeOT - dbAdminFee;
            output.push({
                "Partner": partnerName,
                "Insurer": insurerName,
                "Admin Fee (Fixed): Insurer to OTO": csvAdminFeeIO,
                "Admin Fee (Fixed): OTO To Agent/Customer": csvAdminFeeOT,
                "Difference IO": diffIO,
                "Difference OT": diffOT
              });
          }
          
          const tempFilePath = path.join(os.tmpdir(), `comparison_result_${Date.now()}.csv`);

          const csvWriter = createObjectCsvWriter({
            path: tempFilePath,
            header: [
              { id: "Partner", title: "Partner" },
              { id: "Insurer", title: "Insurer" },
              { id: "Admin Fee (Fixed): Insurer to OTO", title: "Admin Fee (Fixed): Insurer to OTO" },
              { id: "Admin Fee (Fixed): OTO To Agent/Customer", title: "Admin Fee (Fixed): OTO To Agent/Customer" },
              { id: "Difference IO", title: "Difference IO" },
              { id: "Difference OT", title: "Difference OT" },
            ]
          });
          await csvWriter.writeRecords(output);

          res.setHeader("Content-Disposition", "attachment; filename=comparison_result.csv");
          res.setHeader("Content-Type", "text/csv");
  
          const fileStream = fs.createReadStream(tempFilePath);
          fileStream.pipe(res);
  
          // Optional: delete temp file after response is sent
          fileStream.on("close", () => {
            fs.unlink(tempFilePath, (err) => {
              if (err) console.error("Error deleting temp file:", err);
            });
          });
        });
    } catch (error) {
      console.error("Error processing CSV:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };