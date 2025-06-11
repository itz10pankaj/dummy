// app.js
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import fs from "fs";
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/authRouters.js";
import courseRoute from "./routes/courseRoute.js";
import menuRoute from "./routes/menuRoutes.js";
import contentRoute from "./routes/contentRoute.js";
import imageRoute from "./routes/imageRoutes.js";
import categoryRoute from "./routes/categoriesRoute.js";
import itemsRoute from "./routes/ItemsRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";
import photosRoute from "./routes/photoRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import locationRoute from "./routes/LocationRoute.js";
import { getMetaData } from "./controllers/getMetaDataController.js";
import { responseHandler } from "./utlis/responseHandler.js";
import { graphqlUploadExpress } from 'graphql-upload';
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/UserSchema.js";
import { resolvers } from "./graphql/Userresolvers.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/api/meta-title', getMetaData);
app.use("/api/auth", authRoutes);
app.use("/api/", courseRoute);
app.use("/api/", menuRoute);
app.use("/api/", contentRoute);
app.use("/api/", imageRoute);
app.use("/api/", locationRoute);
app.use("/api/", categoryRoute);
app.use("/api/", itemsRoute);
app.use("/api/", photosRoute);
app.use("/api/", logsRoutes);
app.use("/api", chatRoutes);
app.use('/api/pdf', pdfRoutes);

// Static files
app.use("/uploads", express.static("uploads"));
app.use("/photoUpload", express.static("uploads"));
app.use("/bulk-upload", express.static("uploads"));
app.use("/attach", express.static("uploads"));
app.use('/output', express.static('output'));
app.use("/image-handle", express.static("images"));

// Logger
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Optional: dummy live-data route (keep it here if needed)
const check = false;
if (check) {
    app.get('/api/live-data', async (req, res) => {
        try {
            const response = await fetch(
                'http://localhost:9000/exec?query=SELECT ts, value FROM live_data ORDER BY ts DESC LIMIT 20'
            );
            const result = await response.json();

            const data = result.dataset.map(row => ({
                time: row[0],
                value: parseFloat(row[1])
            })).reverse();

            return responseHandler(res, 200, "success", data);
        } catch (err) {
            console.error('Error:', err);
            return responseHandler(res, 500, "error", err);
        }
    });

    const insertData = async () => {
        const value = (Math.random() * 10 + 20).toFixed(2);
        const now = new Date().toISOString();
        const query = `INSERT INTO live_data VALUES('${now}', ${value})`;

        await fetch(`http://localhost:9000/exec?query=${encodeURIComponent(query)}`);
        console.log('Inserted:', value);
    };

    setInterval(insertData, 5000);
}

export const startApolloServer = async (httpServer) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    app.use('/graphql', graphqlUploadExpress());
    server.applyMiddleware({ app, path: '/graphql' });
};

export default app;
