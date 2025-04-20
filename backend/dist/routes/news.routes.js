"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_controller_js_1 = require("../controllers/news.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const news_schema_js_1 = require("../schemas/news.schema.js");
const router = express_1.default.Router();
router.get('/', (0, validate_js_1.validate)(news_schema_js_1.getNewsSchema), news_controller_js_1.getNews);
exports.default = router;
