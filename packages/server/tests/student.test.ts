import { describe, expect, it, suite } from "vitest";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";
import studentMocks from "./common/students.mock";

describe("Students API", () => {
    const { info: schoolInfo } = schoolMocks;

    it("create student under a school", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResonse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResonse.status).toBe(201);
        expect(classResonse.body).toHaveProperty("id");

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResonse.body.id,
            ...studentMocks.info
        });
        expect(studentResponse.status).toBe(201);
        expect(studentResponse.body).toHaveProperty("id");
        expect(studentResponse.body.name).toBe(studentMocks.info.name);
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

        const studentResponse = await studentMocks.create({});
        expect(studentResponse.status).toBe(400);
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

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: 123
        });
        expect(studentResponse.status).toBe(400);
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

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: ""
        });
        expect(studentResponse.status).toBe(400);
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

        const firstStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...studentMocks.info
        });
        expect(firstStudent.status).toBe(201);
        expect(firstStudent.body).toHaveProperty("id");
        expect(firstStudent.body.name).toBe(studentMocks.info.name);

        const secondStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...studentMocks.info
        });
        expect(secondStudent.status).toBe(409);
        expect(secondStudent.body.error).toBe("Conflict");
    });

    it("returns all student under a class", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");

        const firstStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...studentMocks.info
        });
        expect(firstStudent.status).toBe(201);
        expect(firstStudent.body).toHaveProperty("id");
        expect(firstStudent.body.name).toBe(studentMocks.info.name);

        const secondStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: "computer"
        });
        expect(secondStudent.status).toBe(201);
        expect(secondStudent.body).toHaveProperty("id");
        expect(secondStudent.body.name).toBe("computer");

        const subjects = await studentMocks.getStudents({
            schoolId: school.body.id,
            classId: classResponse.body.id
        });
        expect(subjects.status).toBe(200);
        expect(subjects.body.length).toBe(2);
    });
})