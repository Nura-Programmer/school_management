import { describe, it, expect } from "vitest";
import schoolMocks from "./common/schools.mocks";
import teacherMocks from "./common/teachers.mocks";

describe("Teacher API", async () => {
    const { info: schoolInfo } = schoolMocks;

    it("create a teacher under a school", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const { info: teacherInfo } = teacherMocks;
        const res = await teacherMocks.create({ schoolId: school.body.id, ...teacherInfo });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.firstName).toBe(teacherInfo.firstName);
    });

    it("returns 400 if firstName is missing", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const response = await teacherMocks.create({
            schoolId: school.body.id,
            surname: teacherMocks.info.surname
        });

        expect(response.status).toBe(400);
    });

    it("returns 400 if surname is missing", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const response = await teacherMocks.create({
            schoolId: school.body.id,
            firstName: teacherMocks.info.firstName,
        });

        expect(response.status).toBe(400);
    });

    it("returns 400 if schoolId is missing", async () => {
        const response = await teacherMocks.create({
            schoolId: null,
            ...teacherMocks.info
        });

        expect(response.status).toBe(400);
    });

    it("returns 404 if school does not exist", async () => {
        const response = await teacherMocks.create({
            schoolId: 999,
            ...teacherMocks.info
        });

        expect(response.status).toBe(404);
    });

    it("returns 409 if teacher already exists in the same school", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const firstTeacherRes = await teacherMocks.create({
            schoolId: school.body.id,
            ...teacherMocks.info
        });
        expect(firstTeacherRes.status).toBe(201);
        expect(firstTeacherRes.body).toHaveProperty("id");

        const secondTeacherRes = await teacherMocks.create({
            schoolId: school.body.id,
            ...teacherMocks.info
        });

        expect(secondTeacherRes.status).toBe(409);
        expect(secondTeacherRes.body.error).toBe("Conflict");
    });

    it("returns paginated teachers for a school", async () => {
        const school = await schoolMocks.create(schoolInfo);
        expect(school.status).toBe(201);
        expect(school.body).toHaveProperty("id");

        const firstTeacherRes = await teacherMocks.create({
            schoolId: school.body.id,
            ...teacherMocks.info
        });
        expect(firstTeacherRes.status).toBe(201);
        expect(firstTeacherRes.body).toHaveProperty("id");

        const secondTeacherRes = await teacherMocks.create({
            schoolId: school.body.id,
            firstName: "TeacherName",
            surname: "TeacherSurname"
        });
        expect(secondTeacherRes.status).toBe(201);
        expect(secondTeacherRes.body).toHaveProperty("id");

        const teachers = await teacherMocks.getTeachers({
            schoolId: school.body.id,
            page: 1,
            limit: 1
        });

        expect(teachers.status).toBe(200);
        expect(teachers.body.data.length).toBe(1);
        expect(teachers.body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    });
});
