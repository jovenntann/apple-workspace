import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ReadProductSchema = z.object({
  productId: z.string().optional(),
  productName: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

const CursorPointerSchema = z.object({
  SK: z.string(),
  PK: z.string(),
  GSI1PK: z.string().optional(),
  GSI1SK: z.string().optional(),
});

export const ReadProductsSchema = z.object({
  data: z.array(ReadProductSchema).optional(),
  nextCursorPointer: CursorPointerSchema.optional(),
  prevCursorPointer: CursorPointerSchema.optional(),
});

export type ProductItemType = z.infer<typeof ReadProductSchema>;
export class ReadProductDTO extends createZodDto(ReadProductSchema) {}

export type ReadProductType = z.infer<typeof ReadProductSchema>;
export class ReadProductsDTO extends createZodDto(ReadProductsSchema) {}
