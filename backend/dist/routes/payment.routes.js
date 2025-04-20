"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_js_1 = require("../controllers/payment.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const payment_schema_js_1 = require("../schemas/payment.schema.js");
// import { authenticateJWT } from '../middleware/auth.js';
const router = express_1.default.Router();
router.post('/create-order', (0, validate_js_1.validate)(payment_schema_js_1.createOrderSchema), payment_controller_js_1.createOrder);
router.post('/verify-payment', (0, validate_js_1.validate)(payment_schema_js_1.verifyPaymentSchema), payment_controller_js_1.verifyPayment);
exports.default = router;
