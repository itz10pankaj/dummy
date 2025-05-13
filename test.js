import { AppDataSource } from "./server/config/data-source.js";
import {InsuranceBsdkValidity } from "./server/models/hello.js";

const testModel = async () => {
    try {
        // Initialize the connection
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Create test data (optional)
        
        const validList = await new InsuranceBsdkValidity().getValidList({
            day: 13,
            vehicle_condition_id: 2
        });
        console.log("Valid List:", validList);
    } catch (error) {
        console.error("Error during test:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("Data Source has been destroyed.");
    }
};

testModel();