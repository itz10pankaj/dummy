import { AppDataSource } from "../config/data-source.js";
import { Location } from "../models/Location.js";
import { responseHandler } from "../utlis/responseHandler.js";
export const getLocations = async (req, res) => {
    try {
        const locationRepository = AppDataSource.getRepository(Location);
        const locations = await locationRepository.find({
            where: { status: true },
        });

        if (!locations) {
            // return res.status(404).json({ message: "No locations found" });
            return responseHandler.badRequest(res, "No locations found", 404);
        }

        // res.status(200).json(locations);
        return responseHandler.success(res, locations, "Locations fetched successfully", 200);
    } catch (error) {
        console.error("Error fetching locations:", error);
        // res.status(500).json({ message: "Internal server error" });
        return responseHandler.error(res, error, "Internal server error", 500);
    }
}