import request from "supertest";
import { withTestPrisma } from "../helpers/withTestPrisma";
import app from "../../src/app";

type CreateSubjectProps = {
    schoolId?: number | null,
    classId?: number | null,
    name?: string | number | null
}

type GetSubjectsProps = {
    schoolId?: number | null,
    classId?: number | null,
}

const subjectsApi = (
    schoolId?: number | null,
    classId?: number | null
) => `/api/schools/${schoolId}/classes/${classId}/subjects`;

const subjectMocks = {
    info: {
        name: "mathematics"
    },

    create: async ({ schoolId, classId, name }: CreateSubjectProps) => {
        return await withTestPrisma(
            request(app)
                .post(subjectsApi(schoolId, classId))
                .send({
                    name,
                    classId
                })
        );
    },

    getSubjects: async ({ schoolId, classId }: GetSubjectsProps) => {
        return await withTestPrisma(
            request(app)
                .get(subjectsApi(schoolId, classId))
        );
    }
}

export default subjectMocks;