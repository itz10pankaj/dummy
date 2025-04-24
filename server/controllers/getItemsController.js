import { AppDataSource } from "../config/data-source.js";
import { Item } from "../models/Items.js"
import { Category } from "../models/Categories.js";
import { decryptID } from "../middleware/urlencrypt.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";
import fs from "fs"
import path from "path"
import csv from "csv-parser"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
            return responseHandler.badRequest(res, "Category not found", 404);
        }
        const existing = await itemRepository.findOne({
          where: {
            name: name,
            latitude: latitude,
            longitude: longitude,
            category: { id: category.id },
          },
          relations: ["category"],
        });
    
        // ✅ If item already exists
        if (existing) {
          return responseHandler.badRequest(res,"Item already exists", 409);
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
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      if (!latitude || !longitude) {
        return responseHandler.badRequest(res, "Location is required", 400);
      }
      if (!req.file) {
        return responseHandler.badRequest(res, "CSV file not found", 400);
      }
      const itemsToInsert = [];
      let categoryIdFromCSV = null;
      const filePath = path.resolve(req.file.path);
  
      // Read CSV
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.name && row.categoryId) {
            categoryIdFromCSV = row.categoryId.trim();
            itemsToInsert.push({
              name: row.name.trim(),
              latitude,
              longitude,
              categoryId: categoryIdFromCSV
            });
          }
        })
        .on("end", async () => {
          const categoryRepository = AppDataSource.getRepository(Category);
          const itemRepository = AppDataSource.getRepository(Item);
  
          const category = await categoryRepository.findOne({
            where: { id: categoryIdFromCSV },
          });
  
          if (!category) {
            return responseHandler.badRequest(res, "Category not found", 404);
          }
  
          const insertedItems = [];
          const duplicateItems = [];
  
          for (const item of itemsToInsert) {
            // Assign relation
            item.category = category;
  
            const existing = await itemRepository.findOne({
              where: {
                name: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
                category: { id: category.id },
              },
              relations: ["category"],
            });
  
            if (existing) {
              duplicateItems.push({ ...item, status: "Duplicate" });
            } else {
              insertedItems.push(item);
            }
          }
  
          if (insertedItems.length > 0) {
            await itemRepository.save(insertedItems);
  
            const updatedItems = await itemRepository.find({
              where: { category: { id: category.id } },
              relations: ["category"],
            });
  
            await redisClient.setex(
              `Items:${category.id}`,
              3600,
              JSON.stringify(updatedItems)
            );
          }
  
          // Remove uploaded file
          fs.unlinkSync(filePath);
  
          // Combine inserted + duplicate with status
          const allResults = [
            ...insertedItems.map((i) => ({ ...i, status: "Inserted" })),
            ...duplicateItems,
          ];
  
          // CSV output
          const csvString = [
            ["name", "latitude", "longitude", "status"],
            ...allResults.map((item) => [
              item.name,
              item.latitude,
              item.longitude,
              item.status,
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");
  
          // Send as downloadable CSV
          res.setHeader("Content-disposition", `attachment; filename=result.csv`);
          res.setHeader("Content-Type", "text/csv");
          res.status(201).send(csvString);
        });
    } catch (err) {
      console.error("bulk error", err);
      return responseHandler.error(res, err, "Server Error", 500);
    }
  };
  