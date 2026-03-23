import z from 'zod';

export const createClassSchema = z.object({
   name: z
      .string()
      .min(1, 'Class name is required')
      .max(100, 'Class name cannot exist 100 characters.'),
   schoolId: z.number('Class ID must be a number.'),
});

export const getClassSchema = z.object({
   schoolId: z.number('School ID must be a number.'),
   page: z.number().optional(),
   limit: z.number().optional(),
});
