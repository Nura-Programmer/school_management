import { describe, expect, it } from "vitest";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";
import studentMocks from "./common/students.mock";
import markMocks from "./common/marks.mocks";
import subjectMocks from "./common/subjects.mocks";

describe("Marks API", () => {
    it("create a mark for a specific student", async () => {
        const { info: schoolInfo } = schoolMocks;

        const school = await schoolMocks.create(schoolInfo);

        const classResonse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            ...studentMocks.info
        });

        const subjectResponse = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            name: subjectMocks.info.name
        });

        const markResponse = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info
        });
        expect(markResponse.status).toBe(201);
        expect(markResponse.body).toHaveProperty("id");
        expect(markResponse.body.exam).toBe(markMocks.info.exam);
    });

    it("returns 400 validation error for schoolId, classId, sutdentId or subjectId", async () => {
        const school = await schoolMocks.create(schoolMocks.info);
        const classResonse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        const subjectResponse = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            ...subjectMocks.info
        });
        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            ...studentMocks.info
        });
        const markResponse = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info
        });
        const withOutSchoolId = await markMocks.create({
            schoolId: null,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info
        });
        const withOutClassId = await markMocks.create({
            schoolId: school.body.id,
            classId: null,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info
        });
        const withOutStudentId = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: null,
            subjectId: subjectResponse.body.id,
            ...markMocks.info
        });
        const withOutSubjectId = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: null,
            ...markMocks.info
        });

        const whenCAIsNaN = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info,
            ca: Number("A")
        });
        const whenTestIsNaN = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info,
            test: Number("A")
        });
        const whenExamIsNaN = await markMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            studentId: studentResponse.body.id,
            subjectId: subjectResponse.body.id,
            ...markMocks.info,
            exam: Number("A")
        });

        expect(markResponse.status).toBe(201);
        expect(markResponse.body).toHaveProperty("id");
        expect(withOutStudentId.status, "return 400 when studentId is missing").toBe(400);
        expect(withOutSubjectId.status, "return 400 when subjectId is missing").toBe(400);
        expect(whenCAIsNaN.body.error, "returns validation error when ca is NaN").toBe("ValidationError");
        expect(whenTestIsNaN.body.error, "returns validation error when test is NaN").toBe("ValidationError");
        expect(whenExamIsNaN.body.error, "returns validation error when exam is NaN").toBe("ValidationError");
    });

    it("should update a mark", async () => {
        const updatedInfo = { ca: 15, test: 19, exam: 48 };
        const { info: schoolInfo } = schoolMocks;

        const school = await schoolMocks.create(schoolInfo);
        const { id: schoolId } = school.body;

        const classResonse = await classMocks.create({
            schoolId,
            ...classMocks.info
        });
        const { id: classId } = classResonse.body;

        const studentResponse = await studentMocks.create({
            schoolId,
            classId,
            ...studentMocks.info
        });
        const { id: studentId } = studentResponse.body;

        const subjectResponse = await subjectMocks.create({
            schoolId,
            classId,
            name: subjectMocks.info.name
        });
        const { id: subjectId } = subjectResponse.body;

        const markResponse = await markMocks.create({
            schoolId,
            classId,
            studentId,
            subjectId,
            ...markMocks.info
        });
        const { id: markId } = markResponse.body;

        const updateCA = await markMocks.update({
            id: Number(markId),
            schoolId: Number(schoolId),
            classId: Number(classId),
            ca: updatedInfo.ca
        });

        const updateTest = await markMocks.update({
            id: Number(markId),
            schoolId: Number(schoolId),
            classId: Number(classId),
            test: updatedInfo.test
        });

        const updateExam = await markMocks.update({
            id: Number(markId),
            schoolId: Number(schoolId),
            classId: Number(classId),
            exam: updatedInfo.exam
        });

        expect(updateCA.body.ca, "to update ca").toBe(updatedInfo.ca);
        expect(updateTest.body.test, "to update test").toBe(updatedInfo.test);
        expect(updateExam.body.exam, "to update exam").toBe(updatedInfo.exam);
    });
})