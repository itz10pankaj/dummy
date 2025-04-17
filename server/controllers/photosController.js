import { AppDataSource } from "../config/data-source.js";
import { Photo } from "../models/Item_Photos.js";
import { decryptID } from "../middleware/urlencrypt.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";

const getPhotosByItemID = async (itemId) => {
  return await AppDataSource.getRepository(Photo).find({
    where: { item: { id:  (itemId) } },
    relations: ["item"],
  });
}

export const getPhotosController= async (req, res) => {
    try{
        const { itemId } = req.params;
        // console.log("itemId",itemId);
        const decryptedItemId =  decryptID(itemId);;
        // console.log("Decru",decryptedItemId)
        const cachedPhotos = await redisClient.get(`photos:${decryptedItemId}`);
        if (cachedPhotos) {
            console.log("Serving from cache");
            return responseHandler.success(res, JSON.parse(cachedPhotos), "Photos fetched successfully", 200);
        }
        const photos = await getPhotosByItemID(decryptedItemId);
        console.log("photos",photos)
        try {
            await redisClient.setex(`photos:${decryptedItemId}`, 3600, JSON.stringify(photos));
        } catch (redisError) {
            console.error("Redis Store Error:", redisError);
        }
        return responseHandler.success(res, photos, "Photos fetched successfully", 200);    

    }
    catch (err) {
        return responseHandler.error(res, err, "Server Error", 500);
    }
}


const addPhotosByItemId = async (itemId, url) => {
    const photo = AppDataSource.getRepository(Photo).create({ item: { id: itemId }, url });
    return await AppDataSource.getRepository(Photo).save(photo);
}
export const addPhotoController = async (req, res) => {
    try{
        console.log("Uploaded file:", req.files);
        console.log("Item ID:", req.body.itemId);

        const { itemId } = req.body;
        const decryptedItemId = decryptID(itemId); 
        if (!req.files) {
            return responseHandler.badRequest(res, "No file uploaded!", 400);
        }

        const urls = [];
        const uploadedPhotos=[];
        console.log("Urls befpr",urls)
        for (const file of req.files) {
          const imageUrl = `http://localhost:8081/uploads/${file.filename}`;
          console.log(imageUrl)
          const savedPhoto=await addPhotosByItemId(decryptedItemId, imageUrl);
          uploadedPhotos.push({
            id: savedPhoto.id, 
            url: imageUrl,
            filename: file.filename,
            createdAt: savedPhoto.createdAt
            });
          urls.push({ url: imageUrl }); // or just imageUrl
        }
        console.log("Urls after",urls)
        await redisClient.del(`photos:${decryptedItemId}`); 
        return responseHandler.success(res, { uploaded: true,  photos: uploadedPhotos }, "Photo uploaded successfully", 200);
    }
    catch (err) {
        return responseHandler.error(res, err, "Server Error", 500);
    }
}