import z from 'zod';
import validationFields from './validation.fields';

const {
   schoolId, teacherId, firstName, surname, username, password, page, limit
} = validationFields;


export const teacherScheme = z.object({
   firstName, surname, username, password
});

export const createTeacherSchema = teacherScheme.and(
   z.object({ schoolId })
);

export const updateTeacherSchema = z.object({
   schoolId,
   teacherId,
   firstName: firstName.optional(),
   surname: surname.optional(),
   password: password.optional()
});

export const getTeachersSchema = z.object({
   schoolId, page, limit
});
