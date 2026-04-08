import { describe, it, expect } from 'vitest';
import schoolMocks from './common/schools.mocks';
import teacherMocks from './common/teachers.mocks';
import { comparePassword } from '../src/utils/hash';

describe('Teacher API', async () => {
   const { info: schoolInfo } = schoolMocks;

   it('create a teacher under a school', async () => {
      const school = await schoolMocks.create(schoolInfo);

      const { info: teacherInfo } = teacherMocks;
      const res = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherInfo,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.firstName).toBe(teacherInfo.firstName);
   });

   it('returns 400 if firstName is missing', async () => {
      const school = await schoolMocks.create(schoolInfo);
      const { firstName: _, ...teacherWithOutFirstName } = teacherMocks.info

      const response = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherWithOutFirstName
      });

      expect(response.status).toBe(400);
   });

   it('returns 400 if surname is missing', async () => {
      const school = await schoolMocks.create(schoolInfo);
      const { surname: _, ...teacherWithOutSurname } = teacherMocks.info;

      const response = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherWithOutSurname
      });

      expect(response.status).toBe(400);
   });

   it('returns 400 if schoolId is missing', async () => {
      const response = await teacherMocks.create({
         schoolId: null,
         ...teacherMocks.info,
      });

      expect(response.status).toBe(400);
   });

   it('returns 404 if school does not exist', async () => {
      const response = await teacherMocks.create({
         schoolId: 999,
         ...teacherMocks.info,
      });

      expect(response.status).toBe(404);
   });

   it('returns 409 if teacher already exists in the same school', async () => {
      const school = await schoolMocks.create(schoolInfo);

      const firstTeacherRes = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherMocks.info,
      });

      const secondTeacherRes = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherMocks.info,
      });
      expect(secondTeacherRes.status).toBe(409);
      expect(secondTeacherRes.body.error).toBe('Conflict');
   });

   it('returns paginated teachers for a school', async () => {
      const school = await schoolMocks.create(schoolInfo);

      const firstTeacherRes = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherMocks.info,
      });

      const secondTeacherRes = await teacherMocks.create({
         schoolId: school.body.id,
         firstName: 'TeacherName',
         surname: 'TeacherSurname',
         username: "teacherusername",
         password: teacherMocks.info.password
      });

      const teachers = await teacherMocks.getTeachers({
         schoolId: school.body.id,
         page: 1,
         limit: 1,
      });
      expect(teachers.status).toBe(200);
      expect(teachers.body.data.length).toBe(1);
      expect(teachers.body.meta).toEqual({
         page: 1,
         limit: 1,
         hasNext: true,
      });
   });

   it('should updates a teacher', async () => {
      const school = await schoolMocks.create(schoolInfo);

      const { info: teacherInfo } = teacherMocks;
      const teacher = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherInfo,
      });

      const updatedInfo = {
         firstName: 'updatedFirstName',
         surname: 'updatedSurname',
         password: "updatedSecretPassword"
      };

      const updateFirstName = await teacherMocks.update({
         id: teacher.body.id,
         schoolId: school.body.id,
         firstName: updatedInfo.firstName,
      });

      const updateSurname = await teacherMocks.update({
         id: teacher.body.id,
         schoolId: school.body.id,
         surname: updatedInfo.surname,
      });

      const updatePassword = await teacherMocks.update({
         id: teacher.body.id,
         schoolId: school.body.id,
         password: updatedInfo.password,
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
      const school = await schoolMocks.create(schoolInfo);

      const { info: teacherInfo } = teacherMocks;
      const teacher = await teacherMocks.create({
         schoolId: school.body.id,
         ...teacherInfo,
      });

      const deletedTeacher = await teacherMocks.delete(
         teacher.body.id,
         school.body.id
      );

      expect(deletedTeacher.status).toBe(200);
      expect(deletedTeacher.body.id).toBe(teacher.body.id);
   });
});
