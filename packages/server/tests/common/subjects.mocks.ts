import request from 'supertest';
import { withTestPrisma } from '../helpers/withTestPrisma';
import app from '../../src/app';

type CreateSubjectProps = {
   schoolId?: number | null;
   classId?: number | null;
   name?: string | number | null;
};

type UpdateSubjectProps = {
   schoolId: number;
   classId: number;
   subjectId: number;
   name: string;
};

type GetSubjectsProps = {
   schoolId?: number | null;
   classId?: number | null;
};

const subjectsApi = (schoolId?: number | null, classId?: number | null) =>
   `/api/schools/${schoolId}/classes/${classId}/subjects`;

const subjectMocks = {
   info: {
      name: 'mathematics',
   },

   create: async ({ schoolId, classId, name }: CreateSubjectProps) => {
      return await withTestPrisma(
         request(app).post(subjectsApi(schoolId, classId)).send({
            name,
            classId,
         })
      );
   },

   update: async ({
      subjectId,
      classId,
      schoolId,
      name,
   }: UpdateSubjectProps) => {
      return await withTestPrisma(
         request(app)
            .put(`${subjectsApi(schoolId, classId)}/${subjectId}`)
            .send({ name })
      );
   },

   delete: async (schoolId: number, classId: number, subjectId: number) => {
      return await withTestPrisma(
         request(app)
            .delete(`${subjectsApi(schoolId, classId)}/${subjectId}`)
            .send()
      );
   },

   getSubjects: async ({ schoolId, classId }: GetSubjectsProps) => {
      return await withTestPrisma(
         request(app).get(subjectsApi(schoolId, classId))
      );
   },
};

export default subjectMocks;
