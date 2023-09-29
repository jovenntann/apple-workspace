import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { PaginateQuerySchema } from '../../utils/paginate-query.schema';
import { ErrorResponseSchema } from '../../utils/error-response.schema';

export type ProductManagementCategoriesCategory = z.infer<typeof ProductManagementCategoriesCategorySchema>;
export type ProductManagementCategoriesCategoryResponse = z.infer<typeof ProductManagementCategoriesCategoryResponseSchema>;

const ProductManagementCategoriesCategorySchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  description: z.string().optional(),
  created: z.date(),
  updated: z.date()
});

const ProductManagementCategoriesCategoryResponseSchema = z.object({
  data: z.array(ProductManagementCategoriesCategorySchema),
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
      200: ProductManagementCategoriesCategoryResponseSchema,
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
      201: ProductManagementCategoriesCategorySchema
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
