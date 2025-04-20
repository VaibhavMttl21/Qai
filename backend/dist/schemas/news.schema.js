"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsSchema = void 0;
const zod_1 = require("zod");
// Schema for query parameters in the getNews request
exports.getNewsSchema = zod_1.z.object({
    query: zod_1.z.object({
        // Optional query parameters
        topic: zod_1.z.string().optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }).strict(),
    params: zod_1.z.object({}).strict(),
    body: zod_1.z.object({}).strict(),
});
