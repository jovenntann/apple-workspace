import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ReadProductSchema = z.object({
  productId: z.string().optional(), // This is optional because this is not required on dynamodb schema (even its a primary key)
  productCategory: z.string(),
  productName:  z.string(),
  price: z.number(),
  description: z.string().optional(),
  stock:z.number(),
  categoryId: z.string(),
  created: z.date().optional(),
  updated: z.date().optional(),
});


export type ReadProductType = z.infer<typeof ReadProductSchema>;
export class ReadProductDTO extends createZodDto(ReadProductSchema) {}
