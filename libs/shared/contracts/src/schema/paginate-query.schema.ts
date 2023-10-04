import { z } from 'zod';


export const PaginateQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (isNaN(Number(val))) {
        return 0;
      }
      return Number(val);
    })
    .refine((val) => val >= 10 && val <= 100, {
      message: 'Limit must be between 10 and 100'
    }),
  reverse: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  cursorPointer: z.string().optional(),
  direction: z.enum(['prev', 'next']).optional()
});
