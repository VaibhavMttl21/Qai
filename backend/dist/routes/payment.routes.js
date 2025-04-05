"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create-checkout-session', auth_1.auth, payment_controller_1.createCheckoutSession);
router.post('/webhook', payment_controller_1.handleWebhook);
exports.default = router;
