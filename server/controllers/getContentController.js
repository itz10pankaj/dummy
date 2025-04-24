import { AppDataSource } from "../config/data-source.js";
import { Content } from "../models/Content.js";
import { decryptID } from "../middleware/urlencrypt.js";
import {redisClient} from "../config/redis-client.js"
import { Menu } from "../models/Menu.js";
import { responseHandler } from "../utlis/responseHandler.js";
const getContentByMenuId = async (menuId) => {
    return await AppDataSource.getRepository(Content)
        .createQueryBuilder("content")
        .innerJoinAndSelect("content.menu", "menu")
        .where("menu.id = :menuId", { menuId })
        .getMany();
};



export const getContent = async (req, res) => {
    try {
        const { menuId } = req.params;
        const decryptedMenuId = decryptID(menuId);
        const cachedData = await redisClient.get(`content:${decryptedMenuId}`);
        if (cachedData) {
            console.log("Cache hit");
            // return res.json(JSON.parse(cachedData));
            return responseHandler.success(res, JSON.parse(cachedData), "Content fetched successfully", 200);
        }
        console.log("Fetching content for menu ID:", menuId);
        const content = await getContentByMenuId(decryptedMenuId);
        await redisClient.setex(`content:${decryptedMenuId}`, 3600, JSON.stringify(content));
        console.log("Fetched Content:", content);
        // res.json(content);
        return responseHandler.success(res, content, "Content fetched successfully", 200);
    } catch (err) {
        console.error("Error in getContent:", err);
        // res.status(500).json({ message: err.message });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};
export const addContent = async (req, res) => {
    try {
        const { menuId } = req.params;
        const decryptedMenuId = decryptID(menuId);

        if (!decryptedMenuId) {
            // return res.status(400).json({ error: "Invalid Menu ID" });
            return responseHandler.badRequest(res, "Invalid Menu ID", 400);
        }

        const { text } = req.body;

        if (!text) {
            // return res.status(400).json({ error: "Text field is required" });
            return responseHandler.badRequest(res, "Text field is required", 400);
        }

        const menuRepository = AppDataSource.getRepository(Menu);
        const contentRepository = AppDataSource.getRepository(Content);

        // Check if menu exists
        const menu = await menuRepository.findOne({ where: { id: decryptedMenuId } });
        if (!menu) {
            // return res.status(404).json({ error: "Menu not found" });
            return responseHandler.badRequest(res, "Menu not found", 404);
        }

        // Create new content
        const newContent = contentRepository.create({
            text,
            menu, 
        });

        await contentRepository.save(newContent);

        // Update Redis cache
        const updatedContent = await getContentByMenuId(decryptedMenuId);
        await redisClient.setex(`content:${decryptedMenuId}`, 3600, JSON.stringify(updatedContent));

        // res.status(201).json(newContent);
        return responseHandler.success(res, newContent, "Content added successfully", 201);
    } catch (err) {
        console.error("Error in addContent:", err);
        // res.status(500).json({ message: err.message });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};

export const updateContent = async (req, res) => {
    try {
        const { menuId, contentId } = req.params;
        const decryptedMenuId = decryptID(menuId);

        if (!decryptedMenuId) {
            // return res.status(400).json({ error: "Invalid Menu ID" });
            return responseHandler.badRequest(res, "Invalid Menu ID", 400);
        }

        const { text } = req.body;

        if (!text) {
            // return res.status(400).json({ error: "Text field is required" });
            return responseHandler.badRequest(res, "Text field is required", 400);
        }

        const contentRepository = AppDataSource.getRepository(Content);

        // Find the content by ID and menu ID
        const content = await contentRepository.findOne({
            where: { id: contentId, menu: { id: decryptedMenuId } },
            relations: ["menu"],
        });

        if (!content) {
            // return res.status(404).json({ error: "Content not found" });
            return responseHandler.badRequest(res, "Content not found", 404);
        }

        // Update the content text
        content.text = text;
        await contentRepository.save(content);
        // Invalidate Redis cache for the menu
        await redisClient.del(`content:${decryptedMenuId}`);
        console.log(`Cache invalidated for content:${decryptedMenuId}`);

        // Update Redis cache
        const updatedContent = await getContentByMenuId(decryptedMenuId);
        await redisClient.setex(`content:${decryptedMenuId}`, 3600, JSON.stringify(updatedContent));

        // res.status(200).json(content);
        return responseHandler.success(res, content, "Content updated successfully", 200);
    } catch (err) {
        console.error("Error in updateContent:", err);
        res.status(500).json({ message: err.message });
    }
};
