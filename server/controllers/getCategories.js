import { AppDataSource } from "../config/data-source.js";
import { Category } from "../models/Categories.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";

const getAllCategories = async () => {
    return await AppDataSource.getRepository(Category).find();
}
export const getCategories = async (req, res) => {
    try {
        const cacheKey = "all_categories";

        const cachedCategories = await redisClient.get(cacheKey);

        if (cachedCategories) {
            console.log("Cache hit: Returning data from Redis");
            return responseHandler.success(res, JSON.parse(cachedCategories), "Categories fetched successfully", 200);
        }
        const categories = await getAllCategories();
        await redisClient.setex(cacheKey, 3600, JSON.stringify(categories));
        return responseHandler.success(res, categories, "Categories fetched successfully", 200);
    } catch (err) {
        return responseHandler.error(res, err, "Server Error", 500);
    }
}
export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return responseHandler.badRequest(res, "Category name is required", 400);
        }

        const categoryRepository = AppDataSource.getRepository(Category);

        // Check if category already exists
        const existingCategory = await categoryRepository.findOne({ where: { name } });
        if (existingCategory) {
            return responseHandler.badRequest(res, "Category already exists", 400);
        }

        // Create new category
        const newCategory = categoryRepository.create({ name });
        await categoryRepository.save(newCategory);

        // Update Redis cache
        const allCategories = await getAllCategories();
        await redisClient.setex("all_categories", 3600, JSON.stringify(allCategories));

        return responseHandler.success(res, newCategory, "Category added successfully", 201);
    } catch (err) {
        console.error("Error adding category:", err);
        return responseHandler.error(res, err, "Server Error", 500);
    }
}


