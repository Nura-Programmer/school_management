import request from 'supertest';
import { withTestPrisma } from '../helpers/withTestPrisma';
import app from '../../src/app';

type createMarkProps = {
   ca?: number | string | null;
   test?: number | string | null;
   exam?: number | string | null;
   schoolId: string | null;
   classId: string | null;
   subjectId: string | null;
   studentId: string | null;
};

type updateMarkProps = {
   id: string;
   schoolId: string;
   classId: string;
   ca?: number;
   exam?: number;
   test?: number;
};

const marksApi = (schoolId?: string | null, classId?: string | null) =>
   `/api/schools/${schoolId}/classes/${classId}/marks`;

const markMocks = {
   info: { ca: 15, test: 18, exam: 56 },

   create: async (markInfo: createMarkProps) => {
      const {
         schoolId, classId, subjectId, studentId, ca, test, exam
      } = markInfo;

      return await withTestPrisma(
         request(app).post(marksApi(schoolId, classId)).send({
            studentId, subjectId, ca, test, exam
         })
      );
   },

   update: async (markProps: updateMarkProps) => {
      const { id, schoolId, classId, ca, exam, test } = markProps;

      return await withTestPrisma(
         request(app).put(marksApi(schoolId, classId)).send({ id, ca, test, exam })
      );
   },
};

export default markMocks;
