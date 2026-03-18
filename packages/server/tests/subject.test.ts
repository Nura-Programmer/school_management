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

    it("returns 400 when payload is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");

        const subjectResponse = await subjectMocks.create({});
        expect(subjectResponse.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");

        const subjectResponse = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: 123
        });
        expect(subjectResponse.status).toBe(400);
    });

    it("returns structured validation error when name is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");

        const subjectResponse = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: ""
        });
        expect(subjectResponse.status).toBe(400);
    });

    it("returns 409 when subject already exist under a class", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");

        const firstSubject = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...subjectMocks.info
        });
        expect(firstSubject.status).toBe(201);
        expect(firstSubject.body).toHaveProperty("id");
        expect(firstSubject.body.name).toBe(subjectMocks.info.name);

        const secondSubject = await subjectMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...subjectMocks.info
        });
        expect(secondSubject.status).toBe(409);
        expect(secondSubject.body.error).toBe("Conflict");
    });
})