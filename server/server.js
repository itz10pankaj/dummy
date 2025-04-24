import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import http from "http";
import { AppDataSource } from "./config/data-source.js"
import fs from "fs";
import swaggerUi from 'swagger-ui-express';
import { connectToMongo } from "./config/mogodb.js"
import authRoutes from "./routes/authRouters.js"
import courseRoute from "./routes/courseRoute.js"
import menuRoute from "./routes/menuRoutes.js"
import contentRoute from "./routes/contentRoute.js"
import imageRoute from "./routes/imageRoutes.js"
import categoryRoute from "./routes/categoriesRoute.js"
import itemsRoute from "./routes/ItemsRoutes.js"
import logsRoutes from "./routes/logsRoutes.js"
import photosRoute from "./routes/photoRoutes.js"
import { getMetaData } from "./controllers/getMetaDataController.js";
import locationRoute from "./routes/LocationRoute.js"
import { initSocket } from "./config/socket.js";
import chatRoutes from "./routes/chatRoutes.js";

import fileUpload from 'express-fileupload';
import pdfRoutes from "./routes/pdfRoutes.js"
import { responseHandler } from "./utlis/responseHandler.js";
import { ApolloServer } from "apollo-server-express";
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { typeDefs } from "./graphql/UserSchema.js";
import { resolvers } from "./graphql/Userresolvers.js";
dotenv.config();
const app = express();
const httpServer=http.createServer(app);
const server=new ApolloServer({
    typeDefs,
    resolvers
})
initSocket(httpServer);
connectToMongo();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(fileUpload());
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

await AppDataSource.initialize()
// app.use(graphqlUploadExpress());
// await server.start();
// server.applyMiddleware({app,path: '/graphql'})
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
            })).reverse(); // Keep oldest first

            // res.json(data);
            return responseHandler(res, 200, "success", data);
        } catch (err) {
            console.error('Error:', err);
            // res.status(500).send('Something went wrong');
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


app.get('/api/meta-title', getMetaData);
app.use("/api/auth", authRoutes);
app.use("/api/", courseRoute)
app.use("/api/", menuRoute)
app.use("/api/", contentRoute)
app.use("/api/", imageRoute);
app.use("/api/", locationRoute);
app.use("/api", chatRoutes);
app.use("/api/", categoryRoute);
app.use("/api/", itemsRoute);
app.use("/api/", photosRoute);
app.use("/api/",logsRoutes);
app.use('/api/pdf', pdfRoutes);
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});
app.use("/uploads", express.static("uploads"));
app.use("/photoUpload", express.static("uploads"));
app.use("/attach", express.static("uploads"));
app.use('/output', express.static('output'));

// app.use("/uploads/graphql", express.static("uploads/graphql"));

const PORT = process.env.PORT || 8081;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
