import { describe, expect, it } from "vitest";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";
import subjectMocks from "./common/subjects.mocks";

describe("Subjects API", () => {
    const { info: schoolInfo } = schoolMocks;
    it("create subject under a specific class in a school", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResonse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResonse.status).toBe(201);
        expect(classResonse.body).toHaveProperty("id");

        const subjectResponse = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            name: subjectMocks.info.name
        });
        expect(subjectResponse.status).toBe(201);
        expect(subjectResponse.body).toHaveProperty("id");
        expect(subjectResponse.body.name).toBe(subjectMocks.info.name);
    });
})