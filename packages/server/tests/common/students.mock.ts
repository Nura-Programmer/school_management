import request from "supertest";
import app from "../../src/app";
import { withTestPrisma } from "../helpers/withTestPrisma";

type CreateStudentProps = {
    name?: number | string | null,
    classType?: string | null,
    schoolId?: number,
    classId?: number
}

const studentsApi = (
    schoolId?: number | null,
    classId?: number | null
) => `/api/schools/${schoolId}/classes/${classId}/students`;

const studentMocks = {
    info: {
        name: "studentName",
        classType: "A",
    },

    create: async ({ schoolId, classId, name, classType }: CreateStudentProps) => {
        return await withTestPrisma(
            request(app)
                .post(studentsApi(schoolId, classId))
                .send({
                    name,
                    classType,
                    classId,
                    schoolId
                })
        );
    },

    getStudents: async ({ schoolId, classId }: CreateStudentProps) => {
        return await withTestPrisma(
            request(app).get(studentsApi(schoolId, classId))
        );
    }
}


export default studentMocks;