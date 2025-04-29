import { AppDataSource } from "../config/data-source.js"
import { Image } from "../models/Images.js"
import { decryptID } from "../middleware/urlencrypt.js"
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";
import { getMongoDb } from "../config/mogodb.js";
import sharp from 'sharp';
import { Jimp } from 'jimp'
import fs from 'fs';
import path from 'path';
const getImagesbyMenuID = async (menuId) => {
    return await AppDataSource.getRepository(Image).find({
        where: { menu: { id: menuId } },
        relations: ["menu"]
    })
}

export const getImagesController = async (req, res) => {
    try {
        const { menuId } = req.params;
        const decryptedMenuId = decryptID(menuId);
        const cachedImages = await redisClient.get(`images:${decryptedMenuId}`);
        if (cachedImages) {
            console.log("Serving from cache");
            // return res.json(JSON.parse(cachedImages));
            return responseHandler.success(res, JSON.parse(cachedImages), "Images fetched successfully", 200);
        }
        const images = await getImagesbyMenuID(decryptedMenuId);
        try {
            await redisClient.setex(`images:${decryptedMenuId}`, 3600, JSON.stringify(images));
        } catch (redisError) {
            console.error("Redis Store Error:", redisError);
        }
        // res.json(images);
        return responseHandler.success(res, images, "Images fetched successfully", 200);
    } catch (err) {
        // res.status(500).json({message:err.message})
        return responseHandler.error(res, err, "Server Error", 500);
    }
}





//Upload Image

const addImagesByMenuId = async (menuId, imageUrl) => {
    const image = AppDataSource.getRepository(Image).create({ menu: { id: menuId }, imageUrl });
    return await AppDataSource.getRepository(Image).save(image);
}
export const addImageController = async (req, res) => {
    try {
        console.log("Uploaded file:", req.file);
        console.log("Menu ID:", req.body.menuId);

        const { menuId } = req.body;
        const decryptedMenuId = decryptID(menuId);
        if (!req.file) {
            // return res.status(400).json({ message: "No file uploaded!" });
            return responseHandler.badRequest(res, "No file uploaded!", 400);
        }

        // Generate Image URL
        const imageUrl = `http://localhost:8081/uploads/${req.file.filename}`;

        // Save Image URL in Database
        const image = await addImagesByMenuId(decryptedMenuId, imageUrl);
        await redisClient.del(`images:${decryptedMenuId}`);
        // res.status(201).json({
        //     uploaded: true,
        //     url: imageUrl,
        // });
        return responseHandler.success(res, { uploaded: true, url: imageUrl }, "Image uploaded successfully", 201);
    } catch (error) {
        // res.status(500).json({ error: error.message });
        return responseHandler.error(res, error, "Server Error", 500);
    }
};

export const attachController = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
    }
    const { senderId, receiverId } = req.body;
    const fileUrl = `http://localhost:8081/attach/${req.file.filename}`;
    const db = await getMongoDb();
    const msg = {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        file: fileUrl,
        timestamp: new Date(),
    }
    await db.collection("messages").insertOne(msg);
    return responseHandler.success(res, msg, "File sent successfully", 200);
}

//pixel image controller
export const HandleImage = async (req, res) => {
    const { widthSize, heightSize, resizeToFileSize } = req.body;
    const file = req.file;

    if (!file) return responseHandler.badRequest(res, "No file uploaded!", 400);
    const originalPath = path.join('images', file.filename + path.extname(file.originalname));
    const resizedPath = path.join('images', 'resized_' + file.filename + path.extname(file.originalname));

    fs.renameSync(file.path, originalPath);

    if (resizeToFileSize) {
        let targetSizeKB = parseInt(resizeToFileSize);
        let minQuality = 10;
        let maxQuality = 99;
        let bestQuality = maxQuality;
        let sizeInKB = (fs.statSync(originalPath).size / 1024).toFixed(2);
        console.log("Original Size", sizeInKB);
        while (minQuality <= maxQuality) {
            const midQuality = Math.floor((minQuality + maxQuality) / 2);
            await sharp(originalPath)
                .jpeg({ quality: midQuality })
                .toFile(resizedPath);

            sizeInKB = (fs.statSync(resizedPath).size / 1024).toFixed(2);
            console.log("Tried Quality", midQuality, "| Size:", sizeInKB, "KB");

            if (sizeInKB > targetSizeKB) {
                maxQuality = midQuality - 1;
            } else {
                bestQuality = midQuality;
                minQuality = midQuality + 1;
            }
        }

        // Re-save using best quality found (optional, in case last one overshot)
        await sharp(originalPath)
            .jpeg({ quality: bestQuality })
            .toFile(resizedPath);
    } else {
        // Resize based on width and height
        await sharp(originalPath)
            .resize(Number(widthSize), Number(heightSize))
            .toFile(resizedPath);
    }

    return responseHandler.success(res, {
        original: originalPath,
        resized: resizedPath,
    }, 'Image uploaded and resized successfully', 201);
};
