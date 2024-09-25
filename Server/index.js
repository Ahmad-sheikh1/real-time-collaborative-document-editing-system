const express = require("express");
const app = express();
const configureMiddlwares = require("./config/configureMiddlewares");
const connectDB = require("./config/connectDb");
const routes = require("./config/routes");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app)
const SocketManager = require("./Helper/Socket.helper");
const io = new Server(server , {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});


configureMiddlwares(app);

routes(app);

connectDB();

SocketManager(io)

server.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`.magenta.bold);
})

