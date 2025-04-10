import { Server } from "socket.io";
import { saveMessage } from "../models/Messages.js";
import dotenv from "dotenv";
const connectedUsers = new Map(); // userId -> socket.id
dotenv.config();
export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("registerUser", (userId) => {
            console.log(`User registered: ${userId}`);
            connectedUsers.set(userId, socket.id);
            socket.userId = userId;
        });

        socket.on("sendMessage", async ({ senderId, receiverId, text, file }) => {
            console.log(`Message from ${senderId} to ${receiverId}:`, text || file);
        
            const message = { senderId, receiverId ,timestamp: new Date()};
            if (text) {
                message.text = text;
                await saveMessage({ senderId, receiverId, text });
            }
    
            if (file) {
                message.file = file;
            }
        
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", message);
            }
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                connectedUsers.delete(socket.userId);
            }
        });
    });

    return io;
};
