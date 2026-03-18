import request from "supertest";
import app from "../../src/app";
import { withTestPrisma } from "../helpers/withTestPrisma";

type CreateTeacherProps = {
    firstName?: string | null,
    surname?: string | null,
    schoolId: number | null
}

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

    getTeachers: async ({schoolId, page, limit}: GetTeachersProps) => {
        let params = "";

        if(page) params += `?page=${page}`;
        if(limit) {
            params += params.length > 0 ? "&" : "?";
            params += `limit=${limit}`;
        }

        return await withTestPrisma(
            request(app).get(teacherApi(schoolId) + params)
        )
    }
}

export default teacherMocks;