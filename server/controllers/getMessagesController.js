import express from "express";
import { getMongoDb } from "../config/mogodb.js";
const router = express.Router();
export const getChatHistory = async (user1, user2) => {
    const db = await getMongoDb();
    const messages = await db.collection("messages").find({
        $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
        ]
    }).sort({ timestamp: 1 }).toArray();
    return messages;
};
router.get("/chat-history", async (req, res) => {
    const user1 = Number(req.query.user1);
    const user2 = Number(req.query.user2);
    if (!user1 || !user2) {
        return res.status(400).json({ message: "Missing user1 or user2" });
    }

    try {
        const db = await getMongoDb();
        const messages = await db.collection("messages").find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ timestamp: 1 }).toArray();
        // console.log(messages);
        res.json(messages);
    } catch (err) {
        console.error("Error fetching chat history:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
export default router;