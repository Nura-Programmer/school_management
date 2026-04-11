import request from 'supertest';
import { withTestPrisma } from '../helpers/withTestPrisma';
import app from '../../src/app';

type CreateSubjectProps = {
   schoolId?: string | null;
   classId?: string | null;
   name?: string | number | null;
};

type UpdateSubjectProps = {
   schoolId: string;
   classId: string;
   subjectId: string;
   name: string;
};

type GetSubjectsProps = {
   schoolId?: string | null;
   classId?: string | null;
};

const subjectsApi = (schoolId?: string | null, classId?: string | null) =>
   `/api/schools/${schoolId}/classes/${classId}/subjects`;

const subjectMocks = {
   info: { name: 'mathematics' },

   create: async ({ schoolId, classId, name }: CreateSubjectProps) => {
      return await withTestPrisma(
         request(app).post(subjectsApi(schoolId, classId)).send({ name, classId })
      );
   },

   update: async ({ subjectId, classId, schoolId, name }: UpdateSubjectProps) => {
      return await withTestPrisma(
         request(app)
            .put(`${subjectsApi(schoolId, classId)}/${subjectId}`).send({ name })
      );
   },

   delete: async (schoolId: string, classId: string, subjectId: string) => {
      return await withTestPrisma(
         request(app)
            .delete(`${subjectsApi(schoolId, classId)}/${subjectId}`).send()
      );
   },

   getSubjects: async ({ schoolId, classId }: GetSubjectsProps) => {
      return await withTestPrisma(
         request(app).get(subjectsApi(schoolId, classId))
      );
   },
};

export default subjectMocks;
