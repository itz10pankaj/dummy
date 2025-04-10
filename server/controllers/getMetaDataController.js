import { AppDataSource } from "../config/data-source.js";
import { MetaTitle } from "../models/MetaTitle.js";
import { decryptID } from "../middleware/urlencrypt.js";
import { redisClient } from "../config/redis-client.js"; // Redis client import
import { responseHandler } from "../utlis/responseHandler.js"; // Importing response handler
const getAllMetadata = async (metaID) => {
    return await AppDataSource.getRepository(MetaTitle).find({
        where: { id: metaID }
    });
};

export const getMetaData = async (req, res) => {
    try {
        const { metaID, page } = req.query;

        if (metaID) {
            const decryptedMetaID = decryptID(metaID);
            if (!decryptedMetaID) {
                // return res.status(400).json({ error: "Invalid Meta ID" });
                return responseHandler.badRequest(res, "Invalid Meta ID", 400);
            }

            // Check Redis Cache
            const cachedMetadata = await redisClient.get(`metadata:${decryptedMetaID}`);
            if (cachedMetadata) {
                console.log("Serving metadata from cache");
                // return res.json(JSON.parse(cachedMetadata));
                return responseHandler.success(res, JSON.parse(cachedMetadata), "Metadata fetched successfully", 200);
            }

            const metaData = await getAllMetadata(decryptedMetaID);

            // Store in Redis with expiration (1 hour)
            await redisClient.setex(`metadata:${decryptedMetaID}`, 3600, JSON.stringify(metaData));

            // return res.json(metaData);
            return responseHandler.success(res, metaData, "Metadata fetched successfully", 200);
        }

        if (page) {
            // Check Redis Cache
            const cachedPageMeta = await redisClient.get(`metaTitle:${page}`);
            if (cachedPageMeta) {
                console.log("Serving meta title from cache");
                // return res.json({ metaTitle: cachedPageMeta });
                return responseHandler.success(res, { metaTitle: cachedPageMeta }, "Meta title fetched successfully", 200);
            }

            const metaTitleRepo = AppDataSource.getRepository(MetaTitle);
            const metaTitle = await metaTitleRepo.findOne({ where: { page } });
            const title = metaTitle ? metaTitle.title : "Default Title | My Website";

            // Store in Redis with expiration (1 hour)
            await redisClient.setex(`metaTitle:${page}`, 3600, title);

            // return res.json({ metaTitle: title });
            return responseHandler.success(res, { metaTitle: title }, "Meta title fetched successfully", 200);
        }

        // res.status(400).json({ error: "Invalid request" });
        return responseHandler.badRequest(res, "Invalid request", 400);

    } catch (err) {
        // res.status(500).json({ message: err.message });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};
