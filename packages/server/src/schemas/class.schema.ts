import z from 'zod';
import validationFields from './validation.fields';

const { className, schoolId, page, limit } = validationFields;

export const createClassSchema = z.object({
   schoolId, name: className,
});

export const getClassSchema = z.object({
   schoolId, page, limit,
});
