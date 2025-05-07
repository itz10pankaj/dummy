import { AppDataSource } from "../config/data-source.js";
import { InsuranceBasicPremium } from "../models/Premium.js";
import { responseHandler } from "../utlis/responseHandler.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const bulkUploadInsurancePremiums = async (req, res) => {
    try {
        if (!req.file) {
            return responseHandler.badRequest(res, "CSV file not found", 400);
        }

        const filePath = path.resolve(req.file.path);
        let totalRowsProcessed = 0;
        const vehicleTypeMap = {
            "Regular Car": 1,
            "Hybrid": 4,
            "EV": 3,
        };
        const areaTypeMap = {
            "plate_area_1": 1,
            "plate_area_2": 2,
            "plate_area_3": 3,
        };
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const fileLines = fileContent.split("\n").map(line => line.replace(/\r/g, ''));
        const vihicleHeaders = fileLines[0]?.split(",") || [];   
        const areaHeaders = fileLines[1]?.split(",") || []; 

        console.log("Area Headers:", areaHeaders);
        console.log("Vehicle Headers:", vihicleHeaders);

        const dynamicColumnMapping = [];

        for (let i = 0; i < areaHeaders.length; i++) {
            const vehicleTypeName = vihicleHeaders[i]?.trim();
            const araeTypeName = areaHeaders[i]?.trim();

            const vehicleTypeId = vehicleTypeMap[vehicleTypeName];
            const areaId = areaTypeMap[araeTypeName];
            if (vehicleTypeId && areaId) {
                dynamicColumnMapping.push({
                    columnIndex: i,
                    vehicleTypeId,
                    areaId
                });
            }
        }

        console.log("Generated columnMapping:", dynamicColumnMapping);
        const insurance_type_id = parseInt(req.body.insurance_type_id || "1");
        const existingRates = await AppDataSource.getRepository(InsuranceBasicPremium)
            .createQueryBuilder("premium")
            .select([
                "premium.vehicle_type_id",
                "premium.insurance_type_id",
                "premium.plate_area_type_id",
                "premium.rate",
                "premium.min_tsi",
                "premium.max_tsi",
            ])
            .where("premium.insurance_type_id = :insurance_type_id", { insurance_type_id })
            .getMany();
        console.log("Existing Rates:", existingRates);
        const rateMap = new Map();
        const localKeySet = new Set();

        for (const row of existingRates) {
            const key = `${row.vehicle_type_id}_${row.insurance_type_id}_${row.plate_area_type_id}_${row.min_tsi}_${row.max_tsi}`;
            rateMap.set(key, row.rate);
        }

        const dataStream = fs
            .createReadStream(filePath)
            .pipe(
                csv({
                    skipLines: 2,
                    headers: false
                })
            );

        let rowCount = 0;
        const inserts = [];
        const updates = [];
        const skippedDuplicates = [];
        for await (const row of dataStream) {
            rowCount++;
            const values = Object.values(row);
            console.log("Row Values:", values);

            if (values.length < 4 || !values[0]) continue;

            const lowerLimit = parseInt((values[2] || "0").replace(/,/g, ""));
            const upperLimit = parseInt((values[3] || "0").replace(/,/g, ""));
            const insurance_type_id = parseInt(req.body.insurance_type_id || "1");
            for (const mapping of dynamicColumnMapping) {
                const { columnIndex, vehicleTypeId, areaId } = mapping;

                if (columnIndex >= values.length) {
                    continue;
                }

                const rateRaw = values[columnIndex];
                // console.log("Rate Raw:", rateRaw);
                if (!rateRaw) {
                    continue;
                }

                const rate = parseFloat(rateRaw.replace("%", ""));

                if (
                    isNaN(lowerLimit) ||
                    isNaN(upperLimit) ||
                    isNaN(rate)
                ) {
                    continue;
                }

                const key = `${vehicleTypeId}_${insurance_type_id}_${areaId}_${lowerLimit}_${upperLimit}`;
                if (localKeySet.has(key)) {
                    skippedDuplicates.push(key);
                    continue;
                }
                localKeySet.add(key);
                const existingRate = rateMap.get(key);
                if (existingRate !== undefined) {
                    if (existingRate == rate) {
                        skippedDuplicates.push(key);
                    } else {
                        updates.push({
                            vehicle_type_id: vehicleTypeId,
                            insurance_type_id,
                            plate_area_type_id: areaId,
                            min_tsi: lowerLimit,
                            max_tsi: upperLimit,
                            rate,
                        });
                    }
                }else {
                    inserts.push({
                        vehicle_type_id: vehicleTypeId,
                        insurance_type_id,
                        plate_area_type_id: areaId,
                        min_tsi: lowerLimit,
                        max_tsi: upperLimit,
                        rate,
                        status: 1,
                    });
                }
                totalRowsProcessed++;
            }

        }
        if (inserts.length > 0) {
            await AppDataSource.getRepository(InsuranceBasicPremium).save(inserts);
        }

        for (const update of updates) {
            await AppDataSource.getRepository(InsuranceBasicPremium)
                .createQueryBuilder()
                .update(InsuranceBasicPremium)
                .set({ rate: update.rate })
                .where("vehicle_type_id = :vehicle_type_id", { vehicle_type_id: update.vehicle_type_id })
                .andWhere("insurance_type_id = :insurance_type_id", { insurance_type_id: update.insurance_type_id })
                .andWhere("plate_area_type_id = :plate_area_type_id", { plate_area_type_id: update.plate_area_type_id })
                .andWhere("min_tsi = :min_tsi", { min_tsi: update.min_tsi })
                .andWhere("max_tsi = :max_tsi", { max_tsi: update.max_tsi })
                .execute();
        }
        fs.unlinkSync(filePath);

        return responseHandler.success(
            res,
            {
                message: "Upload completed",
                stats: {
                    inserted: inserts.length,
                    updated: updates.length,
                    skippedDuplicates: skippedDuplicates.length,
                    totalProcessed: totalRowsProcessed,
                    rowsFound: rowCount,
                },
            },
            201
        );
    } catch (err) {
        console.error("Error in bulkUploadInsurancePremiums:", err);
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (_) { }
        }
        return responseHandler.error(res, err, "Server Error", 500);
    }
};