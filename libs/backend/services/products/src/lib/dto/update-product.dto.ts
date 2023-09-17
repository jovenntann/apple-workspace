import { z } from 'zod';

export const UpdateProductDtoSchema = z.object({
  productCategory: z.string().optional(),
  productName: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  stock: z.number().optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
