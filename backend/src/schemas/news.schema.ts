import { z } from 'zod';

// Schema for query parameters in the getNews request
export const getNewsSchema = z.object({
  query: z.object({
    // Optional query parameters
    topic: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
  }).strict(),
  params: z.object({}).strict(),
  body: z.object({}).strict(),
});
