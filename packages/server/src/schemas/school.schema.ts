import { z } from 'zod';
import { teacherScheme } from './teacher.schema';
import validationFields from './validation.fields';

const { address, code, schoolName, town, } = validationFields;

export const createSchoolSchema = z.object({
   name: schoolName, code, town, address
}).and(teacherScheme);
