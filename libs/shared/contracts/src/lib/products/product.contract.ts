import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export interface Product {
  productId: string;
  productName: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  created: Date;
  updated: Date;
}

export interface ProductResponse {
  data: Product[];
  nextCursorPointer: {
    SK: string;
    PK: string;
    GSI2PK: string;
    GSI2SK: string;
  };
  prevCursorPointer: {
    SK: string;
    PK: string;
    GSI2PK: string;
    GSI2SK: string;
  };
}

const ProductSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  created: z.date(),
  updated: z.date(),
});

const ProductResponseSchema = z.object({
  data: z.array(ProductSchema),
  nextCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string(),
  }),
  prevCursorPointer: z.object({
    SK: z.string(),
    PK: z.string(),
    GSI2PK: z.string(),
    GSI2SK: z.string(),
  }),
});

const c = initContract();

export const apiProduct = c.router(
    {
      findAllProducts: {
        method: 'GET',
        path: '/api/products',
        responses: {
          200: ProductResponseSchema,
        },
        query: z.object({
          limit: z.string().optional().transform(val => isNaN(Number(val)) ? '10' : val),
          reverse: z.string().optional().transform(val => val === 'true'),
          cursorPointer: z.string().optional(),
          direction: z.string().optional(),
        }),
        summary: 'Get products with optional limit and reverse flag',
        metadata: { roles: ['guest', 'user'] } as const,
      },
    },
  );
  