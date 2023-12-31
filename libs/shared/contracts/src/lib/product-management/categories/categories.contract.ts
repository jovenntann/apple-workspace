import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { PaginateQuerySchema } from '../../../schema/paginate-query.schema';
import { ErrorResponseSchema } from '../../../schema/error-response.schema';

export type ProductManagementCategoriesCategory = z.infer<typeof ProductManagementCategoriesCategorySchema>;
export type ProductManagementCategoriesCreateCategory = z.infer<typeof ProductManagementCategoriesCreateCategorySchema>;
export type ProductManagementCategoriesCategoryResponse = z.infer<typeof ProductManagementCategoriesCategoryResponseSchema>;

const BaseCategorySchema = z.object({
  categoryName: z.string(),
  description: z.string().optional(),
  title: z.string(),
});

const ProductManagementCategoriesCategorySchema = BaseCategorySchema.extend({
  categoryId: z.string(),
  created: z.date(),
  updated: z.date()
});

const ProductManagementCategoriesCreateCategorySchema = BaseCategorySchema;

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
    body: ProductManagementCategoriesCreateCategorySchema,
    summary: 'Create a new category',
    description: 'Create a new category',
    metadata: { roles: ['user'] } as const,
    strictStatusCodes: true
  }
});

