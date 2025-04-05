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
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const prisma = new client_1.PrismaClient();
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Course Access',
                            description: 'Full access to all course videos and community features',
                        },
                        unit_amount: 4900, // $49.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            customer_email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        });
        res.json({ url: session.url });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating checkout session' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            yield prisma.user.update({
                where: { email: session.customer_email },
                data: { isPaid: true },
            });
        }
        res.json({ received: true });
    }
    catch (error) {
        res.status(400).json({ message: 'Webhook error' });
    }
});
exports.handleWebhook = handleWebhook;
