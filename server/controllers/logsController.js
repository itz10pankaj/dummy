import { AppDataSource } from "../config/data-source.js";
import { UserLogs } from "../models/logs.js";
import { User } from "../models/User.js";
import { responseHandler } from "../utlis/responseHandler.js";

// ADD USER LOG
export const addUserLog = async (req, res) => {
  try {
    const { userId, action,status} = req.body;

    if (!userId || !action) {
      return responseHandler.badRequest(res, "userId and action are required", 400);
    }

    const userRepo = AppDataSource.getRepository(User);
    const logRepo = AppDataSource.getRepository(UserLogs);

    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return responseHandler.badRequest(res, "User not Found", 400);
    }

    const newLog = logRepo.create({
      action,
      status,
      userlogged: user,
    });

    await logRepo.save(newLog);

    return responseHandler.success(res, newLog, "Log added successfully", 201);
  } catch (error) {
    console.error("Error adding log:", error);
    return responseHandler.error(res, error, "Server Error", 500);
  }
};

// GET USER LOGS
export const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return responseHandler.badRequest(res, "userId is required", 400);
    }

    const logRepo = AppDataSource.getRepository(UserLogs);

    const logs = await logRepo.find({
      where: {
        userlogged: {
          id: userId,
        },
      },
      relations: ["userlogged"],
      order: {
        createdAt: "DESC",
      },
    });

    return responseHandler.success(res, logs, "Logs fetched successfully", 200);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return responseHandler.error(res, error, "Server Error", 500);
  }
};
