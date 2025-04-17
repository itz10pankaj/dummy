import { AppDataSource } from "../config/data-source.js";
import { Item } from "../models/Items.js"
import { Category } from "../models/Categories.js";
import { decryptID } from "../middleware/urlencrypt.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";
import fs from "fs"
import path from "path"
import csv from "csv-parser"

const getItemsByCategoryId = async (categoryId) => {
    return await AppDataSource.getRepository(Item).find({
        where: { category: { id: categoryId } },
        relations: ["category"],
    });
}

export const getItems = async (req, res) => {
    try {
        let { categoryId } = req.params;
        const decryptedCategoryId = decryptID(categoryId);
        console.log(decryptedCategoryId)
        if (!categoryId) {
            return responseHandler.badRequest(res, "Category ID is required", 400);
        }
        const cachedData = await redisClient.get(`Items:${decryptedCategoryId}`);
        if (cachedData) {
            console.log("Cache hit");
            return responseHandler.success(res, JSON.parse(cachedData), "Items fetched sucessfully", 200);
        }

        if (!decryptedCategoryId) {
            return responseHandler.badRequest(res, "Invalid Category ID", 400);
        }
        const items = await getItemsByCategoryId(decryptedCategoryId);
        await redisClient.setex(`Items:${decryptedCategoryId}`, 3600, JSON.stringify(items));
        return responseHandler.success(res, items, "Items fetched successfully", 200);
    } catch (err) {
        return responseHandler.error(res, err, "Server Error", 500);
    }
}


export const addItem = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const decryptedCategoryId = decryptID(categoryId);
        console.log("hitted")
        if (!decryptedCategoryId) {
            return responseHandler.badRequest(res, "Invalid Category ID", 400);
        }

        const { name, latitude, longitude } = req.body;

        if (!name) {
            return responseHandler.badRequest(res, "Item name is required", 400);
        }
        if (!latitude) {
            return responseHandler.badRequest(res, "Item latitude is required", 400);
        }
        if (!longitude) {
            return responseHandler.badRequest(res, "Item longitude is required", 400);
        }
        const categoryRepository = AppDataSource.getRepository(Category);
        const itemRepository = AppDataSource.getRepository(Item);

        const category = await categoryRepository.findOne({
            where: { id: decryptedCategoryId },
        });
        if (!category) {
            return responseHandler.notFound(res, "Category not found", 404);
        }
        const newItem = itemRepository.create({
            name,
            latitude,
            longitude,
            category,
        });
        await itemRepository.save(newItem);
        const updatedItems = await itemRepository.find({
            where: { category: { id: decryptedCategoryId } },
            relations: ["category"],
        })
        await redisClient.setex(`Items:${decryptedCategoryId}`, 3600, JSON.stringify(updatedItems));
        return responseHandler.success(res, newItem, "Item added successfully", 201);
    }
    catch (err) {
        console.error("Error adding item:", err);
        return responseHandler.error(res, err, "Server Error", 500);
    }
}



export const bulkUploadItems = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const decryptedCategoryId = decryptID(categoryId);
        if (!categoryId || !latitude || !longitude) {
            return responseHandler.badRequest(res, "Category ID and location required", 400);
        }

        const categoryRepository = AppDataSource.getRepository(Category);
        const itemRepository = AppDataSource.getRepository(Item);

        const category = await categoryRepository.findOne({
            where: { id: decryptedCategoryId },
        })
        if (!category) {
            return responseHandler.badRequest(res, "Category not found", 404);
        }

        if (!req.file) {
            return responseHandler.badRequest(res, "CSV file not found", 400);
        }

        const itemsToInsert = [];
        const filePath = path.resolve(req.file.path);
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.name) {
                    itemsToInsert.push({
                        name: row.name.trim(),
                        latitude,
                        longitude,
                        category,
                    });
                }
            })
            .on("end", async () => {
                await itemRepository.save(itemsToInsert);
                fs.unlinkSync(filePath);
                const updatedItems = await itemRepository.find({
                    where: { category: { id: decryptedCategoryId } },
                    relations: ["category"],
                })
                await redisClient.setex(`Items:${decryptedCategoryId}`, 3600, JSON.stringify(updatedItems));
                return responseHandler.success(res, itemsToInsert, "Item added successfully", 201);
            })
    } catch (err) {
        console.error("bulk error", err);
        return responseHandler.error(res, err, "Server Error", 500);
    }
}