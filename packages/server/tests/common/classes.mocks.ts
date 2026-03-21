import request from "supertest";
import app from "../../src/app";
import { withTestPrisma } from "../helpers/withTestPrisma";

type CreateClassProps = {
    schoolId: number,
    name?: string | number | null
}

type UpdateClassProps = { id: number } & CreateClassProps;

type GetClassProps = {
    schoolId: number,
    page?: number,
    limit?: number
}

const classesApi = (schoolId: number | null) => `/api/schools/${schoolId}/classes`;

const classMocks = {
    info: {
        name: "JSS 1"
    },

    create: async ({ schoolId, name }: CreateClassProps) => {
        return await withTestPrisma(
            request(app)
                .post(classesApi(schoolId))
                .send({ name })
        );
    },

    update: async ({ id: classId, schoolId, name }: UpdateClassProps) => {
        return await withTestPrisma(
            request(app).put(`${classesApi(schoolId)}/${classId}`)
                .send({ name })
        );
    },

    delete: async (classId: number, schoolId: number) => {
        return await withTestPrisma(
            request(app).delete(`${classesApi(schoolId)}/${classId}`)
        );
    },

    getClasses: async ({ schoolId, page, limit }: GetClassProps) => {
        let params = "";

        if (page) params += `?page=${page}`;
        if (limit) {
            params += params.length > 0 ? "&" : "?";
            params += `limit=${limit}`;
        }

        return await withTestPrisma(
            request(app).get(classesApi(schoolId) + params)
        );
    }
}

export default classMocks;