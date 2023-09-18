import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCategorySchema = z.object({
  categoryName: z.string({
    description: 'The name of the category',
    required_error: 'Category name is required',
    invalid_type_error: 'Category name must be a string',
  }).nonempty('Category name cannot be empty'),
  description: z.string({
    description: 'The description of the category',
    invalid_type_error: 'Description must be a string',
  }).optional(),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export class CreateCategoryDTO extends createZodDto(CreateCategorySchema) {}