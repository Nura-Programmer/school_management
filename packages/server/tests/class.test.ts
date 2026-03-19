import { describe, it, expect } from "vitest";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";

describe("Class API", () => {
    const { info: schoolInfo } = schoolMocks;

    it("Schould create a class under a school", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(classResponse.status).toBe(201);
        expect(classResponse.body).toHaveProperty("id");
        expect(classResponse.body.name).toBe(classMocks.info.name);
    });

    it("returns 400 when payload is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id
        });
        expect(classResponse.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            name: 123
        })
        expect(classResponse.status).toBe(400);
    });

    it("returns structured valiadation error when name is empty", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const classResponse = await classMocks.create({
            schoolId: school.body.id,
            name: ""
        })
        expect(classResponse.status).toBe(400);
    });

    it("returns 409 when class already exist under the school", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const firstClass = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const secondClass = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });
        expect(secondClass.status).toBe(409);
        expect(secondClass.body.error).toBe("Conflict");
    });

    it("returns paginated classes of a school", async () => {
        const school = await schoolMocks.create(schoolInfo);

        const firstClass = await classMocks.create({
            schoolId: school.body.id,
            ...classMocks.info
        });

        const secondClass = await classMocks.create({
            schoolId: school.body.id,
            name: "JSS 2"
        });

        const classes = await classMocks.getClasses({
            schoolId: school.body.id,
            page: 1,
            limit: 1
        });

        expect(classes.status).toBe(200);
        expect(classes.body.data.length).toBe(1);
        expect(classes.body.meta).toEqual({
            page: 1, limit: 1, hasNext: true
        });
    });
})