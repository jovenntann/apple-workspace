import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { PaginateQuerySchema } from '../../utils/paginate-query.schema';
import { ErrorResponseSchema } from '../../utils/error-response.schema';

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

export const categories = c.router({
  findAllCategories: {
    method: 'GET',
    path: '/api/categories',
    responses: {
      200: ProductManagementProductsCategoryResponseSchema,
      400: ErrorResponseSchema
    },
    query: PaginateQuerySchema,
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
