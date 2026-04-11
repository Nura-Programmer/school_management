import z from 'zod';

export const CreateMarkSchema = z.object({
   ca: z.number('C/A marks must be a number.')
      .min(0, 'C/A must be greater than or equal to zero.')
      .max(20, 'C/A must not exceed 20 marks.')
      .optional(),
   test: z.number('Test marks must be a number.')
      .min(0, 'Test must be greater than or equal to zero.')
      .max(20, 'Test must not exceed 20 marks.')
      .optional(),
   exam: z.number('Exam marks must be a number.')
      .min(0, 'Exam must be greater than or equal to zero.')
      .max(60, 'Exam must not exceed 60 marks.')
      .optional(),
   subjectId: z.cuid2('Invlaid Subject ID.'),
   studentId: z.cuid2('Invlaid Student ID.'),
});

export const UpdateMarkSchema = z.object({
   id: z.cuid2('Invlaid Mark ID.'),
   ca: z.number('C/A marks must be a number.')
      .min(0, 'C/A must be greater than or equal to zero.')
      .max(20, 'C/A must not exceed 20 marks.')
      .optional(),
   test: z.number('Test marks must be a number.')
      .min(0, 'Test must be greater than or equal to zero.')
      .max(20, 'Test must not exceed 20 marks.')
      .optional(),
   exam: z.number('Exam marks must be a number.')
      .min(0, 'Exam must be greater than or equal to zero.')
      .max(60, 'Exam must not exceed 60 marks.')
      .optional(),
});
