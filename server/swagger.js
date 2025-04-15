import swaggerAutogen from 'swagger-autogen';
const doc={
    info:{
        title:"API",
        description:"API Information"
    },
    host:"localhost:8081/api",
}
const output="./swagger.json"
const endpoints=[
    "./routes/authRouters.js",
    "./routes/courseRoute.js",
    "./routes/menuRoutes.js",
    "./routes/contentRoute.js",
    "./routes/imageRoutes.js",
    "./routes/LocationRoute.js",
    "./routes/chatRoutes.js",

]
swaggerAutogen()(output, endpoints, doc)