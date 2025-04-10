
import { getMongoDb } from "../config/mogodb.js";

export const saveMessage=async({senderId, receiverId, text})=>{
    const db=getMongoDb();
    const message={
        senderId,
        receiverId,
        text,
        timestamp: new Date(),
    }
    await db.collection("messages").insertOne(message);
};




