import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { ProductType } from '@apple/backend/dynamodb-onetable';

import { PaginateQuerySchema } from '../../../schema/paginate-query.schema';
import { ErrorResponseSchema } from '../../../schema/error-response.schema';

export type ProductManagementProductsProduct = z.infer<typeof ProductManagementProductsProductSchema>;
export type ProductManagementProductsCreateProduct = z.infer<typeof ProductManagementProductsCreateProductSchema>;
export type ProductManagementProductsProductResponse = z.infer<typeof ProductManagementProductsProductResponseSchema>;

/*
* This is mapped manually from the database schema
? I think it would be better if we could generate this from the database schema so that we can ensure that the types are always in sync
*/

// * This is mapped from the Database schema specifically for the required fields
const BaseProductSchema = z.object({
  productName: z.string(),
  brand: z.string(),
  image: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  is_available: z.boolean(),
  categoryId: z.string()
});

/* 
* This would serve as our typesafety from Contract to Database Schema
* This would cause chain of errors if the database schema is not compatible with the contract
* After updating the Database Schema it would throw an error from isBaseProductSchemaCompatible(product) because we need to update the date field from `product: BaseProductType`
* After updating the product.field it would throw another error because it didn't match the BaseProductSchema
* After updating the BaseProductSchema it would throw another error to the client because it's not incompatible with the contract
*/
const isBaseProductSchemaCompatible = (product: ProductType): boolean => {
  const result = BaseProductSchema.safeParse(product);
  return result.success;
};
export type BaseProductType = z.infer<typeof BaseProductSchema>;
const product: BaseProductType = {
  productName: '',
  brand: '',
  image: '',
  description: '',
  price: 100,
  stock: 100,
  is_available: true,
  categoryId: ''
};
const isProductCompatible = isBaseProductSchemaCompatible(product);
console.log('isProductCompatible', isProductCompatible)

const ProductManagementProductsProductSchema = BaseProductSchema.extend({
  productId: z.string(),
  created: z.date(),
  updated: z.date()
});

// * You might notice that this is the same with BaseProductSchema but without the productId, created, and updated fields
// * The purpose of this is so that we can customize the fields that we want to be required when creating a new product
const ProductManagementProductsCreateProductSchema = BaseProductSchema;

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

export const products = c.router({
  getAllProducts: {
    method: 'GET',
    path: '/api/products',
    responses: {
      200: ProductManagementProductsProductResponseSchema,
      400: ErrorResponseSchema
    },
    query: PaginateQuerySchema,
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
    body: ProductManagementProductsCreateProductSchema,
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
      ...PaginateQuerySchema.shape
    }),
    summary: 'Get products by date range',
    description: 'Get products by date range',
    metadata: { roles: ['guest', 'user'] } as const,
    strictStatusCodes: true
  },

  getProductById: {
    method: 'GET',
    path: '/api/products/:id',
    responses: {
      200: ProductManagementProductsProductSchema
    },
    summary: 'Get product by id',
    description: 'Get product by id',
    metadata: { 
      roles: ['guest', 'user'],
      identifierPath: 'params.id',
    } as const,
    strictStatusCodes: true
  },

  getProductsByCategoryId: {
    method: 'GET',
    path: '/api/products/by-category/:id',
    responses: {
      200: z.array(ProductManagementProductsProductSchema),
      400: ErrorResponseSchema
    },
    summary: 'Get products by category id',
    description: 'Get products by category id',
    metadata: { 
      roles: ['guest', 'user'],
      identifierPath: 'params.id',
    } as const,
    strictStatusCodes: true
  },

});
