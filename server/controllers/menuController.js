import { AppDataSource } from "../config/data-source.js";
import { Menu } from "../models/Menu.js";
import { Course } from "../models/Courses.js";
import { decryptID } from "../middleware/urlencrypt.js";
import {redisClient} from "../config/redis-client.js"
import { responseHandler } from "../utlis/responseHandler.js";
import {decryptPayload,encryptPayload} from "../utlis/Decryption.js";
export const getMenusByCourseId = async (courseId) => {
    return await AppDataSource.getRepository(Menu).find({
        where: { course: { id: courseId } },
        relations: ["course"]
    });
};
 


export const getMenu=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const decryptedCourseId = decryptID(courseId);
        if (!courseId) {
            // return res.status(400).json({ error: "Course ID is required" });
            return responseHandler.badRequest(res, "Course ID is required", 400);
        }
        const courseRepository = AppDataSource.getRepository(Course);
        const existingCourse = await courseRepository.findOne({ where: { id: decryptedCourseId } });
        if (!existingCourse) {
            // return res.status(404).json({ message: "Course not found" });
            return responseHandler.badRequest(res, "Course not found", 404);
        }
        const cachedData = await redisClient.get(`Menu:${decryptedCourseId}`);
        if (cachedData) {
            console.log("Cache hit");
            // return res.json(JSON.parse(cachedData)); // Redis se response return
            return responseHandler.success(res, JSON.parse(cachedData), "Menu fetched successfully", 200);
        }
        
        if (!decryptedCourseId) {
            // return res.status(400).json({ error: "Invalid Course ID" });
            return responseHandler.badRequest(res, "Invalid Course ID", 400);
        }
        const menu=await getMenusByCourseId(decryptedCourseId);
        await redisClient.setex(`Menu:${decryptedCourseId}`, 3600, JSON.stringify(menu));
        // res.json(menu);
        return responseHandler.success(res, menu, "Menu fetched successfully", 200);
    }catch(err){
        // res.status(500).json({message:err.message})
        return responseHandler.error(res, err, "Server Error", 500);
    }
}

export const addMenu = async (req, res) => {
    try {
        const { courseId } = req.params;
        const decryptedCourseId = decryptID(courseId);
        
        if (!decryptedCourseId) {
            // return res.status(400).json({ error: "Invalid Course ID" });
            return responseHandler.badRequest(res, "Course ID missing", 400);
        }

        const encryptedData = req.body.data;
        if (!encryptedData) {
            return responseHandler.badRequest(res, "Encrypted data is required", 400);
        }

        const { name } = decryptPayload(encryptedData);

        if (!name) {
            // return res.status(400).json({ message: "Menu name is required" });
            return responseHandler.badRequest(res, "Menu name is required", 400);
        }

        const courseRepository = AppDataSource.getRepository(Course);
        const menuRepository = AppDataSource.getRepository(Menu);

        // Check if course exists
        const existingCourse = await courseRepository.findOne({ where: { id: decryptedCourseId } });
        if (!existingCourse) {
            // return res.status(404).json({ message: "Course not found" });
            return responseHandler.badRequest(res, "Course not found", 404);
        }

        // Create new menu item
        const newMenu = menuRepository.create({ name, course: existingCourse });
        await menuRepository.save(newMenu);

        // Update Redis cache for menus of the course
        const updatedMenus = await menuRepository.find({
            where: { course: { id: decryptedCourseId } },
            relations: ["course"]
        });
        await redisClient.setex(`Menu:${decryptedCourseId}`, 3600, JSON.stringify(updatedMenus));
        const encryptedResponse = encryptPayload(newMenu);
        return responseHandler.success(res, encryptedResponse, "Menu added successfully", 201);
    } catch (err) {
        console.error("Error adding menu:", err);
        // res.status(500).json({ message: err.message });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};
