import request from 'supertest';
import app from '../../src/app';
import { withTestPrisma } from '../helpers/withTestPrisma';

type CreateStudentProps = {
   name?: number | string | null;
   classType?: string | null;
   schoolId?: string;
   classId?: string;
};

type UpdateStudentProps = {
   schoolId: string;
   classId: string;
   studentId: string;
   name: string;
};

const studentsApi = (schoolId?: string | null, classId?: string | null) =>
   `/api/schools/${schoolId}/classes/${classId}/students`;

const studentMocks = {
   info: { name: 'studentName', classType: 'A' },

   create: async ({ schoolId, classId, name, classType }: CreateStudentProps) => {
      return await withTestPrisma(
         request(app).post(studentsApi(schoolId, classId)).send({
            name, classType, classId, schoolId,
         })
      );
   },

   update: async ({ studentId, classId, schoolId, name, }: UpdateStudentProps) => {
      return await withTestPrisma(
         request(app)
            .put(`${studentsApi(schoolId, classId)}/${studentId}`)
            .send({ name })
      );
   },

   delete: async (schoolId: string, classId: string, studentId: string) => {
      return await withTestPrisma(
         request(app)
            .delete(`${studentsApi(schoolId, classId)}/${studentId}`)
            .send()
      );
   },

   getStudents: async ({ schoolId, classId }: CreateStudentProps) => {
      return await withTestPrisma(
         request(app).get(studentsApi(schoolId, classId))
      );
   },
};

export default studentMocks;
