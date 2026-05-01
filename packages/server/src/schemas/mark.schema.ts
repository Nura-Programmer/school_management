import z from 'zod';
import validationFields from './validation.fields';

const { subjectId, studentId, markId, ca, test, exam } = validationFields;

export const CreateMarkSchema = z.object({
   ca, test, exam, subjectId, studentId,
});

export const UpdateMarkSchema = z.object({
   markId, ca, test, exam,
});
