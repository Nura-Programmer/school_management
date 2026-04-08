import { z } from 'zod';
import { teacherScheme } from './teacher.schema';

export const createSchoolSchema = z.object({
   name: z.string().min(1, 'School name is required'),
   code: z.string().length(8, "Valid school code is required."),
   town: z.string().min(3, "School town is required.").max(40),
   address: z.string().optional(),
}).and(teacherScheme);
