import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
export  const  redisClient = new Redis({
    host: process.env.REDIS_HOST, // Local Redis server
    port: process.eventNames.REDIS_PORT,        // Default Redis port
});

// Redis errors handle karna
redisClient.on("error", (err) => {
    console.error("Redis Error:", err); 
});
