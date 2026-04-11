import z from 'zod';

export const createSubjectSchema = z.object({
   name: z.string()
      .min(1, 'Subject name is required.')
      .max(100, 'Subject nqame must not exceed 100 characters.'),
   classId: z.cuid2("Invalid class ID."),
});

export const updateSubjectSchema = z.object({
   name: z.string()
      .min(1, 'Subject name is required.')
      .max(100, 'Subject nqame must not exceed 100 characters.'),
   subjectId: z.cuid2("Invalid subject ID."),
});

export const deleteSubjectSchema = z.object({
   subjectId: z.cuid2("Invalid subject ID"),
});

export const getSubjectsSchema = z.object({
   classId: z.cuid2("Invalid class ID."),
   page: z.number().optional(),
   limit: z.number().optional(),
});
