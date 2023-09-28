import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export type ProductManagementProductsProduct = z.infer<typeof ProductManagementProductsProductSchema>;
export type ProductManagementProductsProductResponse = z.infer<typeof ProductManagementProductsProductResponseSchema>;

const ProductManagementProductsProductSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  created: z.date(),
  updated: z.date()
});

const ProductManagementProductsProductResponseSchema = z.object({
  data: z.array(ProductManagementProductsProductSchema),
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

export const productContract = c.router({
  findAllProducts: {
    method: 'GET',
    path: '/api/products',
    responses: {
      200: ProductManagementProductsProductResponseSchema,
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
      201: ProductManagementProductsProductSchema
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
  },

  getProductsByDateRange: {
    method: 'GET',
    path: '/api/products/by-date-range',
    responses: {
      200: ProductManagementProductsProductResponseSchema,
      400: ErrorResponseSchema
    },
    query: z.object({
      startDate: z.string().transform((date) => new Date(date)),
      endDate: z.string().transform((date) => new Date(date)),
      ...QuerySchema.shape
    }),
    summary: 'Get products by date range',
    description: 'Get products by date range',
    metadata: { roles: ['guest', 'user'] } as const,
    strictStatusCodes: true
  }
});
