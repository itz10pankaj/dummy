import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const mongoDbName = "change_logs"; // Replace with your MongoDB database name
const mongoUri=process.env.MONGO_URI; 
let mongoClient;
let db;

export const connectToMongo = async () => {
    if (!mongoClient) {
        mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
        await mongoClient.connect();
        db = mongoClient.db(mongoDbName);
        console.log("Connected to MongoDB");
    }
    return db;
};

export const getMongoDb = () => {
    if (!db) {
        throw new Error("MongoDB not connected. Call connectToMongo() first.");
    }
    return db;
};