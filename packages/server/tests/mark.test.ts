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
})