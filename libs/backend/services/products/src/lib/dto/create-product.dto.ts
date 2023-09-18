import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateProductSchema = z.object({
  productName: z.string({
    description: 'The name of the product',
    required_error: 'Product name is required',
    invalid_type_error: 'Product name must be a string',
  }).nonempty('Product name cannot be empty'),
  
  price: z.number({
    description: 'The price of the product',
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }).min(0, 'Price cannot be negative'),

  description: z.string({
    description: 'The description of the product',
    invalid_type_error: 'Description must be a string',
  }).optional(),

  stock: z.number({
    description: 'The stock of the product',
    required_error: 'Stock is required',
    invalid_type_error: 'Stock must be a number',
  }).min(0, 'Stock cannot be negative'),

  categoryId: z.string({
    description: 'The category ID of the product',
    required_error: 'Category ID is required',
    invalid_type_error: 'Category ID must be a string',
  })
  .nonempty('Category ID cannot be empty')
  .refine(value => /^[0-9A-Z]{26}$/.test(value), {
    message: 'Category ID must be a valid ULID',
  }),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;
export class CreateProductDTO extends createZodDto(CreateProductSchema) {}
