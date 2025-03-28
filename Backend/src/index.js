"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var auth_route_1 = require("./routes/auth.route");
var message_route_1 = require("./routes/message.route");
var dotenv = require("dotenv");
var db_1 = require("./lib/db");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var socket_1 = require("./lib/socket");
dotenv.config();
socket_1.app;
socket_1.app.use(express.json({ limit: "3mb" }));
socket_1.app.use(express.urlencoded({ limit: "3mb", extended: true }));
socket_1.app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Allow cookies if needed
}));
socket_1.app.use(cookieParser());
socket_1.app.use('/api/auth', auth_route_1.default);
socket_1.app.use('/api/messages', message_route_1.default);
var PORT = process.env.PORT;
socket_1.server.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
    (0, db_1.connetDB)();
});
