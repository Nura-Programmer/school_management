import request from "supertest";
import app from "../../src/app";
import { withTestPrisma } from "../helpers/withTestPrisma";

type CreateTeacherProps = {
    firstName?: string | null,
    surname?: string | null,
    schoolId: number | null
}

type UpdateTeacherProps = { id: number } & CreateTeacherProps;

type GetTeachersProps = {
    schoolId: number,
    page?: number,
    limit?: number
}

const teacherApi = (schoolId: number | null) => `/api/schools/${schoolId}/teachers`;

const teacherMocks = {
    info: {
        firstName: "Nura",
        surname: "Pro",
    },

    create: async ({ schoolId, firstName, surname }: CreateTeacherProps) => {
        return await withTestPrisma(
            request(app)
                .post(teacherApi(schoolId))
                .send({ firstName, surname })
        );
    },

    update: async ({ id, schoolId, firstName, surname }: UpdateTeacherProps) => {
        let payload: UpdateTeacherProps = { id, schoolId };

        if (firstName) payload.firstName = firstName;
        if (surname) payload.surname = surname;

        return await withTestPrisma(
            request(app).put(`${teacherApi(schoolId)}/${id}`).send(payload)
        );
    },

    delete: async (id: number, schoolId: number) => {
        return await withTestPrisma(
            request(app).delete(`${teacherApi(schoolId)}/${id}`).send()
        );
    },

    getTeachers: async ({ schoolId, page, limit }: GetTeachersProps) => {
        let params = "";

        if (page) params += `?page=${page}`;
        if (limit) {
            params += params.length > 0 ? "&" : "?";
            params += `limit=${limit}`;
        }

        return await withTestPrisma(
            request(app).get(teacherApi(schoolId) + params)
        )
    }
}

export default teacherMocks;