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
exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount) * 100,
            currency: 'INR',
            receipt: crypto_1.default.randomBytes(10).toString('hex'),
        };
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Something went wrong!' });
                return;
            }
            res.status(200).json({ data: order });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSign = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest('hex');
        if (expectedSign === razorpay_signature) {
            yield prisma.payment.create({
                data: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                },
            });
            res.json({ message: 'Payment Successful' });
        }
        else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.verifyPayment = verifyPayment;
