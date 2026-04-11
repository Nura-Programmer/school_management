import z from 'zod';

export const createClassSchema = z.object({
   name: z
      .string()
      .min(1, 'Class name is required')
      .max(100, 'Class name cannot exist 100 characters.'),
   schoolId: z.cuid2('Invlaid Class ID.'),
});

export const getClassSchema = z.object({
   schoolId: z.cuid2('Invalid School ID'),
   page: z.number().optional(),
   limit: z.number().optional(),
});
