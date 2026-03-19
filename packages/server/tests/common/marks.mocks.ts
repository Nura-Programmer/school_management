import request from "supertest";
import { withTestPrisma } from "../helpers/withTestPrisma"
import app from "../../src/app";

type createMarkProps = {
    ca?: number | string | null,
    test?: number | string | null,
    exam?: number | string | null,
    schoolId: number | null,
    classId: number | null,
    subjectId: number | null,
    studentId: number | null
}

const marksApi = (
    schoolId?: number | null,
    classId?: number | null
) => `/api/schools/${schoolId}/classes/${classId}/marks`;


const markMocks = {
    info: {
        ca: 15,
        test: 18,
        exam: 56
    },

    create: async (markInfo: createMarkProps) => {
        const {
            schoolId,
            classId,
            subjectId,
            studentId,
            ca,
            test,
            exam
        } = markInfo;

        return await withTestPrisma(
            request(app)
                .post(marksApi(schoolId, classId))
                .send({
                    studentId,
                    subjectId,
                    ca,
                    test,
                    exam
                })
        )
    }
}

export default markMocks;