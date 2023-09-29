import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export type ProductManagementProductsCategory = z.infer<typeof ProductManagementProductsCategorySchema>;
export type ProductManagementProductsCategoryResponse = z.infer<typeof ProductManagementProductsCategoryResponseSchema>;

const ProductManagementProductsCategorySchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  description: z.string().optional(),
  created: z.date(),
  updated: z.date()
});

const ProductManagementProductsCategoryResponseSchema = z.object({
  data: z.array(ProductManagementProductsCategorySchema),
  nextCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string()
  }),
  prevCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string()
  })
});

const c = initContract();

const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number()
});

const QuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (isNaN(Number(val))) {
        return 0;
      }
      return Number(val);
    })
    .refine((val) => val >= 10 && val <= 100, {
      message: 'Limit must be between 10 and 100'
    }),
  reverse: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  cursorPointer: z.string().optional(),
  direction: z.enum(['prev', 'next']).optional()
});

export const categories = c.router({
  findAllCategories: {
    method: 'GET',
    path: '/api/categories',
    responses: {
      200: ProductManagementProductsCategoryResponseSchema,
      400: ErrorResponseSchema
    },
    query: QuerySchema,
    summary: 'Get categories with optional limit and reverse flag',
    description: 'Get categories with optional limit and reverse flag',
    metadata: { roles: ['guest', 'user'] } as const,
    strictStatusCodes: true
  },

  createCategory: {
    method: 'POST',
    path: '/api/categories',
    responses: {
      201: ProductManagementProductsCategorySchema
    },
    body: z.object({
      categoryName: z.string(),
      description: z.string().optional()
    }),
    summary: 'Create a new category',
    description: 'Create a new category',
    metadata: { roles: ['user'] } as const,
    strictStatusCodes: true
  }
});
