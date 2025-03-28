"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
var socket_io_1 = require("socket.io");
var http = require("http");
var express = require("express");
var app = express();
exports.app = app;
var server = http.createServer(app);
exports.server = server;
var io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});
exports.io = io;
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
var userSocketMap = {};
io.on("connection", function (socket) {
    console.log("a new client connected", socket.id);
    var userId = Array.isArray(socket.handshake.query.userId)
        ? socket.handshake.query.userId[0]
        : socket.handshake.query.userId;
    console.log('userid-->', userId);
    if (userId)
        userSocketMap[userId] = socket.id;
    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", function () {
        console.log("a client disconnected", socket.id);
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});
