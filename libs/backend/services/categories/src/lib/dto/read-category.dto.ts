import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ReadCategorySchema = z.object({
  categoryId: z.string().optional(), // This is optional because this is not required on dynamodb schema (even its a primary key)
  categoryName: z.string(),
  description: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export type ReadCategoryType = z.infer<typeof ReadCategorySchema>;
export class ReadCategoryDTO extends createZodDto(ReadCategorySchema) {}
