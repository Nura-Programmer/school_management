import request from 'supertest';
import { withTestPrisma } from '../helpers/withTestPrisma';
import app from '../../src/app';
import teacherMocks from './teachers.mocks';

type CreateSchoolProps = {
   name?: string | number | null;
   code?: string | number | null;
   town?: string | null;
   address?: string | null;

   firstName?: string | null;
   surname?: string | null;
   username?: string | null;
   password?: string | null;
};

type UpdateSchoolProps = { id: number } & CreateSchoolProps;

type GetSchoolProps = {
   page?: number;
   limit?: number;
};

const schoolApi = '/api/schools';

const schoolMocks = {
   info: {
      name: 'Annur International School',
      address: '123 Main St, Cityville',
      code: '00123456',
      town: "townName",
      id: null,
      ...teacherMocks.info
   },

   create: async (schoolPayload: CreateSchoolProps) => {
      return await withTestPrisma(
         request(app).post(schoolApi).send(schoolPayload)
      );
   },

   update: async (updatePayload: UpdateSchoolProps) => {
      const { id } = updatePayload;
      let payload: CreateSchoolProps = { ...updatePayload };

      return await withTestPrisma(
         request(app).put(`${schoolApi}/${id}`).send(payload)
      );
   },

   delete: async (id: number) => {
      return await withTestPrisma(
         request(app).delete(`${schoolApi}/${id}`).send()
      );
   },

   getSchools: async ({ page, limit }: GetSchoolProps) => {
      let params = '';

      if (page) params += `?page=${page}`;
      if (limit) {
         params += params.length > 0 ? '&' : '?';
         params += `limit=${limit}`;
      }

      return await withTestPrisma(request(app).get(schoolApi + params));
   },

   getCrash: async (crashUrl = '/api/__test__/crash') => {
      return await withTestPrisma(request(app).get(crashUrl));
   },
};

export default schoolMocks;
