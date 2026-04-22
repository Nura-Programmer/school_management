import request from 'supertest';
import app from '../../src/app';
import { withTestPrisma } from '../helpers/withTestPrisma';

type CreateTeacherProps = {
   firstName?: string | null;
   surname?: string | null;
   username?: string | null;
   password?: string | null;
   schoolId: string | null;
};

type UpdateTeacherProps = { id: string } & CreateTeacherProps;

type GetTeachersProps = {
   schoolId: string;
   page?: number;
   limit?: number;
};

const teacherApi = (schoolId: string | null) =>
   `/api/schools/${schoolId}/teachers`;

const teacherMocks = {
   info: {
      firstName: 'Nura',
      surname: 'Pro',
      username: "nurapro",
      password: "secretPassword"
   },

   login: async ({ schoolId, username, password }: { schoolId: string, username: string, password: string }) => {
      return await withTestPrisma(
         request(app).post(`/api/schools/${schoolId}/auth`).send({
            username, password
         })
      );
   },

   create: async ({ schoolId, firstName, surname, username, password }: CreateTeacherProps) => {
      return await withTestPrisma(
         request(app).post(teacherApi(schoolId)).send({
            firstName, surname, username, password
         })
      );
   },

   update: async ({ id, schoolId, firstName, surname, password }: UpdateTeacherProps) => {
      let payload: UpdateTeacherProps = { id, schoolId, password };

      if (firstName) payload.firstName = firstName;
      if (surname) payload.surname = surname;
      if (password) payload.password = password;

      return await withTestPrisma(
         request(app)
            .put(`${teacherApi(schoolId ?? "")}/${id}`)
            .send(payload)
      );
   },

   delete: async (id: string, schoolId: string) => {
      return await withTestPrisma(
         request(app)
            .delete(`${teacherApi(schoolId)}/${id}`)
            .send()
      );
   },

   getTeachers: async ({ schoolId, page, limit }: GetTeachersProps) => {
      let params = '';

      if (page) params += `?page=${page}`;
      if (limit) {
         params += params.length > 0 ? '&' : '?';
         params += `limit=${limit}`;
      }

      return await withTestPrisma(
         request(app).get(teacherApi(schoolId) + params)
      );
   },
};

export default teacherMocks;
