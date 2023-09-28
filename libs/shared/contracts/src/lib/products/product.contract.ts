import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export type Product = z.infer<typeof ProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

const ProductSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  created: z.date(),
  updated: z.date()
});

const ProductResponseSchema = z.object({
  data: z.array(ProductSchema),
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
        return '0';
      }
      return val;
    })
    .refine((val) => Number(val) >= 10 && Number(val) <= 100, {
      message: 'Limit must be between 10 and 100'
    }),
  reverse: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  cursorPointer: z.string().optional(),
  direction: z.enum(['prev', 'next']).optional()
});

export const apiProduct = c.router({
  findAllProducts: {
    method: 'GET',
    path: '/api/products',
    responses: {
      200: ProductResponseSchema,
      400: ErrorResponseSchema
    },
    query: QuerySchema,
    summary: 'Get products with optional limit and reverse flag',
    description: 'Get products with optional limit and reverse flag',
    metadata: { roles: ['guest', 'user'] } as const,
    strictStatusCodes: true
  },

  createProduct: {
    method: 'POST',
    path: '/api/products',
    responses: {
      201: ProductSchema
    },
    body: z.object({
      productName: z.string(),
      description: z.string().optional(),
      price: z.number(),
      stock: z.number(),
      categoryId: z.string()
    }),
    summary: 'Create a new product',
    description: 'Create a new product',
    metadata: { roles: ['user'] } as const,
    strictStatusCodes: true
  }
});
