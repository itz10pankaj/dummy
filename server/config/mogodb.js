import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoDbName = "change_logs"; 
const mongoUri = process.env.MONGO_URI;
let mongoClient = null;
let db = null;

// Ensure proper connection management by reusing client
export const connectToMongo = async () => {
  if (!mongoClient) {
    try {
      mongoClient = new MongoClient(mongoUri);
      await mongoClient.connect();
      db = mongoClient.db(mongoDbName);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }
  return db;
};

export const getMongoDb = () => {
  if (!db) {
    throw new Error("MongoDB not connected. Call connectToMongo() first.");
  }
  return db;
};

export const closeMongoConnection = async () => {
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  }
};
