import z from 'zod';
import validationFields from './validation.fields';

const { classId, schoolId, studentId, name, classType, page, limit } = validationFields;

export const createStudentSchema = z.object({
   name, classType, classId, schoolId,
});

export const updateStudentSchema = z.object({
   studentId, name,
});

export const deleteStudentSchema = z.object({
   studentId,
});

export const getStudentsSchema = z.object({
   schoolId, page, limit,
});
