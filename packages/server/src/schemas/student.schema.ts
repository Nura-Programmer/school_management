import z from 'zod';

export const createStudentSchema = z.object({
   name: z.string()
      .min(3, 'Name must not be less than 3 characters')
      .max(100, 'Name must not exceed 100 characters.'),
   classType: z.string()
      .length(1, 'Class type must be a single character. e.g A, B, C.'),
   classId: z.cuid2("Invalid class ID."),
   schoolId: z.cuid2("Invalid school ID."),
});

export const updateStudentSchema = z.object({
   studentId: z.cuid2("Invalid student ID."),
   name: z.string()
      .min(3, 'Name must not be less than 3 characters')
      .max(100, 'Name must not exceed 100 characters.'),
});

export const deleteStudentSchema = z.object({
   studentId: z.cuid2("Invalid student ID."),
});

export const getStudentsSchema = z.object({
   schoolId: z.cuid2("Invalid school ID."),
   page: z.number().optional(),
   limit: z.number().optional(),
});
