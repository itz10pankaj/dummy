import http from "http";
import app, { startApolloServer } from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import { connectToMongo } from "./config/mogodb.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 8081;

const httpServer = http.createServer(app);

export const initializeServer = async () => {
  try {
    initSocket(httpServer);
    await AppDataSource.initialize();
    await connectToMongo();
    await startApolloServer(httpServer);

    return httpServer;
  } catch (err) {
    console.error("Error initializing server:", err);
    throw err;
  }
};

if (process.env.NODE_ENV !== "test") {
  initializeServer().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}