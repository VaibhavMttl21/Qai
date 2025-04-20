"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_js_1 = require("../middleware/validate.js");
const auth_schema_js_1 = require("../schemas/auth.schema.js");
const router = express_1.default.Router();
router.post('/register', auth_controller_js_1.register);
router.post('/google', auth_controller_js_1.googleAuth);
router.post('/forgot-password', auth_controller_js_1.forgotPassword);
router.post('/generate-otp', (0, validate_js_1.validate)(auth_schema_js_1.generateOTPSchema), auth_controller_js_1.generateOTP);
router.post('/verify-otp', (0, validate_js_1.validate)(auth_schema_js_1.verifyOTPSchema), auth_controller_js_1.verifyOTP);
router.post('/login', (0, validate_js_1.validate)(auth_schema_js_1.loginSchema), auth_controller_js_1.login);
router.post('/reset-password', (0, validate_js_1.validate)(auth_schema_js_1.resetPasswordSchema), auth_controller_js_1.resetPassword);
exports.default = router;
