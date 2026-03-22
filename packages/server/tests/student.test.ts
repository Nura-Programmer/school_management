import { describe, expect, it, suite } from "vitest";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";
import studentMocks from "./common/students.mock";

describe("Students API", () => {
    const { info: schoolInfo } = schoolMocks;

    it("create student under a school", async () => {
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
        expect(studentResponse.status).toBe(201);
        expect(studentResponse.body).toHaveProperty("id");
        expect(studentResponse.body.name).toBe(studentMocks.info.name);
    });

    it("returns 400 when payload is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const studentResponse = await studentMocks.create({});
        expect(studentResponse.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: 123
        });
        expect(studentResponse.status).toBe(400);
    });

    it("returns structured validation error when name is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const studentResponse = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: ""
        });
        expect(studentResponse.status).toBe(400);
    });

    it("returns 409 when student already exist under a class", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const firstStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...studentMocks.info
        });

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

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const firstStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            ...studentMocks.info
        });

        const secondStudent = await studentMocks.create({
            schoolId: school.body.id,
            classId: classResponse.body.id,
            name: "nura",
            classType: "A"
        });

        const student = await studentMocks.getStudents({
            schoolId: school.body.id,
            classId: classResponse.body.id
        });
        expect(student.status).toBe(200);
        expect(student.body.length).toBe(2);
    });

    it("should update a student", async () => {
        const updatedName = "updatedName";

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

        const updatedStudent = await studentMocks.update({
            studentId: studentResponse.body.id,
            classId: classResonse.body.id,
            schoolId: school.body.id,
            name: updatedName
        });

        expect(updatedStudent.status).toBe(200);
        expect(updatedStudent.body.name).toBe(updatedName);
    });

    it("should delete a student", async () => {
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

        const deletedStudent = await studentMocks.delete(
            school.body.id,
            classResonse.body.id,
            studentResponse.body.id
        );

        expect(deletedStudent.status).toBe(200);
        expect(deletedStudent.body.id).toBe(studentResponse.body.id);
    });
});