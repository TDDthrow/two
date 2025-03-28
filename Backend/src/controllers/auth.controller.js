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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
var user_model_1 = require("../models/user.model");
var bcrypt = require("bcryptjs");
var utiles_1 = require("../lib/utiles");
var cloudinary_1 = require("../lib/cloudinary");
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, user, salt, hashedPassword, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                if (!fullName || !email || !password) {
                    res.status(400).json({ message: "All fields are required" });
                    return [2 /*return*/];
                }
                if (password.length < 6) {
                    res.status(400).json({ message: 'Password must be at least 6 characters' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (user) {
                    res.status(400).json({ message: "Email already exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 4:
                hashedPassword = _b.sent();
                newUser = new user_model_1.default({
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                });
                if (!newUser) return [3 /*break*/, 6];
                (0, utiles_1.generateToken)(newUser._id.toString(), res);
                return [4 /*yield*/, newUser.save()];
            case 5:
                _b.sent();
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                });
                return [3 /*break*/, 7];
            case 6:
                res.status(400).json({ message: "Invalid user data" });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                if (error_1 instanceof Error) {
                    console.log("Error in signup controller", error_1.message);
                    res.status(500).json({ message: error_1.message || "Internal Server Error" });
                }
                else {
                    console.log("Unexpected error in signup controller", error_1);
                    res.status(500).json({ message: "Internal Server Error" });
                }
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordCorrect, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(400).json({ message: "Invalid username or password" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 3:
                isPasswordCorrect = _b.sent();
                if (!isPasswordCorrect) {
                    res.status(400).json({ message: "Invalid username or password" });
                    return [2 /*return*/];
                }
                (0, utiles_1.generateToken)(user._id.toString(), res);
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePic: user.profilePic
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                if (error_2 instanceof Error) {
                    console.log("Error in login controller", error_2.message);
                    res.status(500).json({ message: error_2.message || "Internal Server Error" });
                }
                else {
                    console.log("Unexpected error in login controller", error_2);
                    res.status(500).json({ message: "Internal Server Error" });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error in logout controller:", error.message);
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
        else {
            console.log("Unexpected error in logout controller:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
exports.logout = logout;
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profilePic, userId, uploadResponse, updatedUser, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                profilePic = req.body.profilePic;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!profilePic) {
                    res.status(400).json({ message: "Profile pic is required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, cloudinary_1.default.uploader.upload(profilePic)];
            case 1:
                uploadResponse = _b.sent();
                return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })];
            case 2:
                updatedUser = _b.sent();
                res.status(200).json(updatedUser);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.log("error in update profile:", error_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
var checkAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized: No user found" });
                return [2 /*return*/];
            }
            res.status(200).json(req.user);
        }
        catch (error) {
            console.error("Error in checkAuth controller:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
        return [2 /*return*/];
    });
}); };
exports.checkAuth = checkAuth;
