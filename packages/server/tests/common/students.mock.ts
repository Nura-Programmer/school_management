import request from "supertest";
import app from "../../src/app";
import { withTestPrisma } from "../helpers/withTestPrisma";

type CreateStudentProps = {
    name?: number | string | null,
    classType?: string | null,
    schoolId?: number,
    classId?: number
}

type UpdateStudentProps = {
    schoolId: number,
    classId: number,
    studentId: number,
    name: string
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

    update: async ({ studentId, classId, schoolId, name }: UpdateStudentProps) => {
        return await withTestPrisma(
            request(app).put(
                `${studentsApi(schoolId, classId)}/${studentId}`
            ).send({ name })
        );
    },

    delete: async (schoolId: number, classId: number, studentId: number) => {
        return await withTestPrisma(
            request(app).delete(
                `${studentsApi(schoolId, classId)}/${studentId}`
            ).send()
        );
    },

    getStudents: async ({ schoolId, classId }: CreateStudentProps) => {
        return await withTestPrisma(
            request(app).get(studentsApi(schoolId, classId))
        );
    }
}


export default studentMocks;