import z from 'zod';
import validationFields from './validation.fields';

const { subjectId, subjectName, classId, page, limit } = validationFields;

export const createSubjectSchema = z.object({
   name: subjectName, classId,
});

export const updateSubjectSchema = z.object({
   name: subjectName, subjectId,
});

export const deleteSubjectSchema = z.object({
   subjectId
});

export const getSubjectsSchema = z.object({
   classId, page, limit
});
