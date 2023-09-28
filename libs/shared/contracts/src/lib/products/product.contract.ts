import { initContract } from '@ts-rest/core';
import { z } from 'zod';

/*
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
*/

/*
? Can i just use ProductSchema as Interface?
* A: No, you cannot directly use a Zod schema as a TypeScript interface. They serve different purposes and work at different stages of the code execution.
* A TypeScript interface is a compile-time construct used by the TypeScript compiler for type checking. It doesn't exist at runtime and doesn't provide any runtime validation or transformation capabilities.
* On the other hand, a Zod schema is a runtime construct used for data validation and transformation at runtime. It doesn't provide any compile-time type checking.
* However, Zod provides a utility function infer that can be used to derive a TypeScript type from a Zod schema. This can be used to create a type that can be used similarly to an interface.

* In this code, Product is a type derived from ProductSchema. It can be used similarly to an interface for type checking. But remember, 
* it's not an interface, it's a type. There are some differences between interfaces and types in TypeScript, but for most use cases, they can be used interchangeably.
*/

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
      return '0'; // return a default value
    }
    return val;
  })
  .refine((val) => Number(val) >= 10 && Number(val) <= 100, {
    message: 'Limit must be between 10 and 100'
  }),
  // * Since Query is String and we are expecting a boolean I think it would be better to use enum and transform it to boolean
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
      201: ProductSchema,
    },
    body: z.object({
      productName: z.string(),
      description: z.string().optional(),
      price: z.number(),
      stock: z.number(),
      categoryId: z.string(),
    }),
    summary: 'Create a new product',
    description: 'Create a new product',
    metadata: { roles: ['user'] } as const,
    strictStatusCodes: true
  }
});

/*
? EXAMPLES: Since Body, Query and Params (not sure) from Request is String we need to convert it to Date using Zod
* created: z.string().transform((val) => new Date(val)),
* updated: z.string().transform((val) => new Date(val))
*/