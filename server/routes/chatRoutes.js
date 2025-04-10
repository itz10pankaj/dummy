import express from 'express';
import { getChatHistory } from '../controllers/getMessagesController.js';
const router = express.Router();

router.get("/chat-history", async (req, res) => {
    const user1 = Number(req.query.user1);
    const user2 = Number(req.query.user2);

    if (!user1 || !user2) {
        return res.status(400).json({ message: "Missing user1 or user2" });
    }

    try {
        const messages = await getChatHistory(user1, user2);
        res.json(messages);
    } catch (err) {
        console.error("Error fetching chat history:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;