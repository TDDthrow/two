"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getUserForSidebar = void 0;
var user_model_1 = require("../models/user.model");
var message_model_1 = require("../models/message.model");
var cloudinary_1 = require("../lib/cloudinary");
var socket_1 = require("../lib/socket");
var getUserForSidebar = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedUserId, filteredUsers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user) {
                    res.status(401).json({ message: "Unauthorized: No user found" });
                    return [2 /*return*/];
                }
                loggedUserId = req.user._id;
                return [4 /*yield*/, user_model_1.default.find({ _id: { $ne: loggedUserId } }).select("-password")];
            case 1:
                filteredUsers = _a.sent();
                res.status(200).json(filteredUsers);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log("error in getUserForSidebar:", error_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserForSidebar = getUserForSidebar;
var getMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userToChatId, myId, messages, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user) {
                    res.status(401).json({ message: "Unauthorized: No user found" });
                    return [2 /*return*/];
                }
                userToChatId = req.params.id;
                myId = req.user._id;
                return [4 /*yield*/, message_model_1.default.find({
                        $or: [
                            { senderId: myId, receiverId: userToChatId },
                            { senderId: userToChatId, receiverId: myId }
                        ]
                    })];
            case 1:
                messages = _a.sent();
                res.status(200).json(messages);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log("error in getMessages controller:", error_2);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMessages = getMessages;
var sendMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, text, image, receiverId, senderId, imageUrl, uploadResponse, newMessage, receiverSocketId, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, text = _a.text, image = _a.image;
                receiverId = req.params.id;
                if (!req.user) {
                    res.status(401).json({ message: "Unauthorized: No user found" });
                    return [2 /*return*/];
                }
                senderId = req.user._id;
                imageUrl = void 0;
                if (!image) return [3 /*break*/, 2];
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(image)];
            case 1:
                uploadResponse = _b.sent();
                imageUrl = uploadResponse.secure_url;
                _b.label = 2;
            case 2:
                newMessage = new message_model_1.default({
                    senderId: senderId,
                    receiverId: receiverId,
                    text: text,
                    image: imageUrl
                });
                return [4 /*yield*/, newMessage.save()];
            case 3:
                _b.sent();
                receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
                if (receiverSocketId) {
                    socket_1.io.to(receiverSocketId).emit('newMessage', newMessage);
                }
                res.status(200).json(newMessage);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.log("error in sendMessage controller:", error_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
