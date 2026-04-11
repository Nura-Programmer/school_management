import { describe, expect, it } from 'vitest';
import schoolMocks from './common/schools.mocks';
import classMocks from './common/classes.mocks';
import studentMocks from './common/students.mock';
import markMocks from './common/marks.mocks';
import subjectMocks from './common/subjects.mocks';

describe('Marks API', () => {
   const { info: schoolInfo } = schoolMocks;
   const { info: classInfo } = classMocks;
   const { info: studentInfo } = studentMocks;
   const { info: subjectInfo } = subjectMocks;
   const { info: markInfo } = markMocks;

   it('create a mark for a specific student', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResonse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const studentResponse = await studentMocks.create({
         ...studentInfo, schoolId: school.id, classId: classResonse.body.id,
      });

      const subjectResponse = await subjectMocks.create({
         schoolId: school.id, classId: classResonse.body.id, name: subjectInfo.name
      });

      const markResponse = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
      });
      expect(markResponse.status).toBe(201);
      expect(markResponse.body).toHaveProperty('id');
      expect(markResponse.body.exam).toBe(markInfo.exam);
   });

   it('returns 400 validation error for schoolId, classId, sutdentId or subjectId', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResonse = await classMocks.create({ ...classInfo, schoolId: school.id });
      const subjectResponse = await subjectMocks.create({
         ...subjectInfo, schoolId: school.id, classId: classResonse.body.id
      });
      const studentResponse = await studentMocks.create({
         ...studentInfo, schoolId: school.id, classId: classResonse.body.id
      });
      const markResponse = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
      });
      const withOutSchoolId = await markMocks.create({
         ...markInfo,
         schoolId: null,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
      });
      const withOutClassId = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: null,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
      });
      const withOutStudentId = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: null,
         subjectId: subjectResponse.body.id,
      });
      const withOutSubjectId = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: null,
      });

      const whenCAIsNaN = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
         ca: Number('A'),
      });
      const whenTestIsNaN = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
         test: Number('A'),
      });
      const whenExamIsNaN = await markMocks.create({
         ...markInfo,
         schoolId: school.id,
         classId: classResonse.body.id,
         studentId: studentResponse.body.id,
         subjectId: subjectResponse.body.id,
         exam: Number('A'),
      });

      expect(markResponse.status).toBe(201);
      expect(markResponse.body).toHaveProperty('id');
      expect(
         withOutStudentId.status, 'return 400 when studentId is missing'
      ).toBe(400);
      expect(
         withOutSubjectId.status, 'return 400 when subjectId is missing'
      ).toBe(400);
      expect(
         whenCAIsNaN.body.error, 'returns validation error when ca is NaN'
      ).toBe('ValidationError');
      expect(
         whenTestIsNaN.body.error, 'returns validation error when test is NaN'
      ).toBe('ValidationError');
      expect(
         whenExamIsNaN.body.error, 'returns validation error when exam is NaN'
      ).toBe('ValidationError');
   });

   it('should update a mark', async () => {
      const updatedInfo = { ca: 15, test: 19, exam: 48 };
      const { info: schoolInfo } = schoolMocks;

      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;
      const { id: schoolId } = school.body;

      const classResonse = await classMocks.create({ schoolId, ...classInfo });
      const { id: classId } = classResonse.body;

      const studentResponse = await studentMocks.create({
         ...studentInfo, schoolId, classId
      });
      const { id: studentId } = studentResponse.body;

      const subjectResponse = await subjectMocks.create({
         schoolId, classId, name: subjectInfo.name,
      });
      const { id: subjectId } = subjectResponse.body;

      const markResponse = await markMocks.create({
         ...markInfo, schoolId, classId, studentId, subjectId,
      });
      const { id: markId } = markResponse.body;

      const updateCA = await markMocks.update({
         id: markId, schoolId, classId, ca: updatedInfo.ca,
      });

      const updateTest = await markMocks.update({
         id: markId, schoolId, classId, test: updatedInfo.test,
      });

      const updateExam = await markMocks.update({
         id: markId, schoolId, classId, exam: updatedInfo.exam,
      });

      expect(updateCA.body.ca, 'to update ca').toBe(updatedInfo.ca);
      expect(updateTest.body.test, 'to update test').toBe(updatedInfo.test);
      expect(updateExam.body.exam, 'to update exam').toBe(updatedInfo.exam);
   });
});
