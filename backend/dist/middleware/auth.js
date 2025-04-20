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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAdminUser = exports.isPaidUser = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaclient_1 = __importDefault(require("../lib/prismaclient"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.auth = auth;
const isPaidUser = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isPaid)) {
        return res.status(403).json({ message: 'Premium access required' });
    }
    next();
};
exports.isPaidUser = isPaidUser;
const isAdminUser = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userType) !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
exports.isAdminUser = isAdminUser;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user || user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.isAdmin = isAdmin;
