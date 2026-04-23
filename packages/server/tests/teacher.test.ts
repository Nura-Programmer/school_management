import { describe, it, expect } from 'vitest';
import schoolMocks from './common/schools.mocks';
import teacherMocks from './common/teachers.mocks';
import { comparePassword } from '../src/utils/hash';

describe('Teacher API', async () => {
   const { info: schoolInfo } = schoolMocks;
   const { info: teacherInfo } = teacherMocks;

   it('create a teacher under a school', async () => {
      const { body, status } = await schoolMocks.create(schoolInfo);
      const { school, teacher } = body;

      expect(status).toBe(201);
      expect(teacher).toHaveProperty('id');
      expect(teacher.firstName).toBe(teacherInfo.firstName);
   });

   it('returns 400 if firstName is missing', async () => {
      const { firstName: _, ...teacherWithOutFirstName } = schoolInfo;
      const response = await schoolMocks.create(teacherWithOutFirstName);

      expect(response.status).toBe(400);
   });

   it('returns 400 if surname is missing', async () => {
      const { surname: _, ...teacherWithOutSurname } = schoolInfo;
      const response = await schoolMocks.create(teacherWithOutSurname);

      expect(response.status).toBe(400);
   });

   it('returns 404 if schoolId is missing', async () => {
      const response = await teacherMocks.create({ ...teacherInfo, schoolId: null })

      expect(response.status).toBe(404);
   });

   it('returns 404 if school does not exist', async () => {
      const response = await teacherMocks.create({ ...teacherInfo, schoolId: "999" });

      expect(response.status).toBe(404);
   });

   it('returns 409 if teacher already exists in the same school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const { status, body } = await teacherMocks.create({
         ...teacherInfo, schoolId: school.id
      });

      expect(status).toBe(409);
      expect(body.error).toBe('Conflict');
   });

   it('returns paginated teachers for a school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const secondTeacherRes = await teacherMocks.create({
         schoolId: school.id,
         firstName: 'TeacherName',
         surname: 'TeacherSurname',
         username: "teacherusername",
         password: teacherInfo.password
      });
      const { status, body } = await teacherMocks.getTeachers({
         page: 1, limit: 1, schoolId: school.id
      });

      expect(status).toBe(200);
      expect(body.data.length).toBe(1);
      expect(body.meta).toEqual({ page: 1, limit: 1, hasNext: true });
   });

   it('should updates a teacher', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school, teacher } = response.body;
      const updatedInfo = {
         firstName: 'updatedFirstName',
         surname: 'updatedSurname',
         password: "updatedSecretPassword"
      };

      const updateFirstName = await teacherMocks.update({
         id: teacher.id, schoolId: school.id, firstName: updatedInfo.firstName,
      });

      const updateSurname = await teacherMocks.update({
         id: teacher.id, schoolId: school.id, surname: updatedInfo.surname,
      });

      const updatePassword = await teacherMocks.update({
         id: teacher.id, schoolId: school.id, password: updatedInfo.password,
      });

      expect(updateFirstName.body.firstName, "to update teacher's first name")
         .toBe(updatedInfo.firstName);
      expect(updateSurname.body.surname, "to update teacher's surname")
         .toBe(updatedInfo.surname);

      const isCorrectPassword = await comparePassword(
         updatedInfo.password, updatePassword.body.password
      );
      expect(isCorrectPassword, "to update teacher's password")
         .toBe(true);

   });

   it('should delete a teacher', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school, teacher } = response.body;

      const deletedTeacher = await teacherMocks.delete(teacher.id, school.id);

      expect(deletedTeacher.status).toBe(200);
      expect(deletedTeacher.body.id).toBe(teacher.id);
   });

   it('login teacher', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { teacher } = response.body;
      const { status, body } = await teacherMocks.login({ ...teacher, password: schoolInfo.password });

      expect(status, "response status to be 200").toBe(200);
      expect(body.isAuthenticated, "response body to contain isAuthenticated to be true").toBe(true);
   });
});
