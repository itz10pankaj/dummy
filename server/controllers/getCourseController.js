import { AppDataSource } from "../config/data-source.js";
import { Course } from "../models/Courses.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";
const getAllCourses=async()=>{
    return await AppDataSource.getRepository(Course).find();
}

export const getCourses=async(req,res)=>{
    try{
        const cacheKey = "all_courses";

        const cachedCourses = await redisClient.get(cacheKey);

        if (cachedCourses) {
            console.log("Cache hit: Returning data from Redis");
            // return res.json(JSON.parse(cachedCourses)); // Redis se data parse karke return
            return responseHandler.success(res, JSON.parse(cachedCourses), "Courses fetched successfully", 200);
        }
        const courses=await getAllCourses();
        await redisClient.setex(cacheKey, 3600, JSON.stringify(courses));
        // res.json(courses);
        return responseHandler.success(res, courses, "Courses fetched successfully", 200);
    }catch(err){
        // res.status(500).json({message:err.message});
        return responseHandler.error(res, err, "Server Error", 500);
    }
}

export const addCourse = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            // return res.status(400).json({ message: "Course name is required" });
            return responseHandler.badRequest(res, "Course name is required", 400);
        }

        const courseRepository = AppDataSource.getRepository(Course);

        // Check if course already exists
        const existingCourse = await courseRepository.findOne({ where: { name } });
        if (existingCourse) {
            // return res.status(400).json({ message: "Course already exists" });
            return responseHandler.badRequest(res, "Course already exists", 400);
        }

        // Create new course
        const newCourse = courseRepository.create({ name });
        await courseRepository.save(newCourse);

        // Update Redis cache
        const allCourses = await getAllCourses();
        await redisClient.setex("all_courses", 3600, JSON.stringify(allCourses));

        // res.status(201).json(newCourse);
        return responseHandler.success(res, newCourse, "Course added successfully", 201);
    } catch (err) {
        console.error("Error adding course:", err);
        // res.status(500).json({ message: err.message });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};


