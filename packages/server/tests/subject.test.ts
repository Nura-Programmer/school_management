import { describe, expect, it } from 'vitest';
import schoolMocks from './common/schools.mocks';
import classMocks from './common/classes.mocks';
import subjectMocks from './common/subjects.mocks';

describe('Subjects API', () => {
   const { info: schoolInfo } = schoolMocks;
   const { info: classInfo } = classMocks;
   const { info: subjectInfo } = subjectMocks;

   it('create subject under a specific class in a school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResonse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const subjectResponse = await subjectMocks.create({
         schoolId: school.id, classId: classResonse.body.id, name: subjectInfo.name,
      });
      expect(subjectResponse.status).toBe(201);
      expect(subjectResponse.body).toHaveProperty('id');
      expect(subjectResponse.body.name).toBe(subjectInfo.name);
   });

   it('returns 400 when payload is empty', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const subjectResponse = await subjectMocks.create({});
      expect(subjectResponse.status).toBe(400);
   });

   it('returns 400 when name is not a string', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const subjectResponse = await subjectMocks.create({
         schoolId: school.id, classId: classResponse.body.id, name: 123,
      });
      expect(subjectResponse.status).toBe(400);
   });

   it('returns structured validation error when name is empty', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const subjectResponse = await subjectMocks.create({
         schoolId: school.id, classId: classResponse.body.id, name: '',
      });
      expect(subjectResponse.status).toBe(400);
   });

   it('returns 409 when subject already exist under a class', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const firstSubject = await subjectMocks.create({
         ...subjectInfo, schoolId: school.id, classId: classResponse.body.id,
      });

      const secondSubject = await subjectMocks.create({
         ...subjectInfo, schoolId: school.id, classId: classResponse.body.id,
      });
      expect(secondSubject.status).toBe(409);
      expect(secondSubject.body.error).toBe('Conflict');
   });

   it('returns all subjects under a class', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const firstSubject = await subjectMocks.create({
         ...subjectInfo, schoolId: school.id, classId: classResponse.body.id,
      });

      const secondSubject = await subjectMocks.create({
         schoolId: school.id, classId: classResponse.body.id, name: 'computer',
      });

      const subjects = await subjectMocks.getSubjects({
         schoolId: school.id, classId: classResponse.body.id,
      });
      expect(subjects.status).toBe(200);
      expect(subjects.body.length).toBe(2);
   });

   it('should update a subject', async () => {
      const updatedName = 'updatedName';
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;
      const { id: schoolId } = school.body;

      const classResonse = await classMocks.create({ ...classInfo, schoolId });
      const { id: classId } = classResonse.body;

      const subjectResponse = await subjectMocks.create({
         schoolId, classId, name: subjectInfo.name
      });
      const { id: subjectId } = subjectResponse.body;

      const updatedSubject = await subjectMocks.update({
         name: updatedName, subjectId, classId, schoolId,
      });

      expect(updatedSubject.status).toBe(200);
      expect(updatedSubject.body.name).toBe(updatedName);
   });

   it('should delete a subject', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResonse = await classMocks.create({ ...classInfo, schoolId: school.id });

      const subjectResponse = await subjectMocks.create({
         schoolId: school.id, classId: classResonse.body.id, name: subjectInfo.name,
      });

      const deletedSubject = await subjectMocks.delete(
         school.id, classResonse.body.id, subjectResponse.body.id
      );

      expect(deletedSubject.status).toBe(200);
      expect(deletedSubject.body.id).toBe(subjectResponse.body.id);
   });
});
