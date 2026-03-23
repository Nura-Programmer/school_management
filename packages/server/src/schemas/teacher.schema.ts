import z from 'zod';

export const createTeacherSchema = z.object({
   firstName: z
      .string()
      .min(3, 'First name must be atleat 3 characters.')
      .max(100, 'First name must not exceed 100 characters.'),
   surname: z
      .string()
      .min(3, 'Second name must be atleat 3 characters.')
      .max(100, 'Second name must not exceed 100 characters.'),
   schoolId: z.number('School ID must be a number.'),
});

export const updateTeacherSchema = z.object({
   teacherId: z.number('Teacher ID must be a number.'),
   schoolId: z.number('School ID must be a number.'),
   firstName: z
      .string()
      .min(3, 'First name must be atleat 3 characters.')
      .max(100, 'First name must not exceed 100 characters.')
      .optional(),
   surname: z
      .string()
      .min(3, 'Second name must be atleat 3 characters.')
      .max(100, 'Second name must not exceed 100 characters.')
      .optional(),
});

export const getTeachersSchema = z.object({
   schoolId: z.number('School ID must be a number.'),
   page: z.number().optional(),
   limit: z.number().optional(),
});
