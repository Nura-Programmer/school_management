import request from "supertest";
import { describe, expect, it } from "vitest";
import { withTestPrisma } from "./helpers/withTestPrisma";
import app from "../src/app";
import schoolMocks from "./common/schools.mocks";
import classMocks from "./common/classes.mocks";

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

        const subjectResponse = await withTestPrisma(request(app).post(
            `/api/schools/${school.body.id}/classes/${classResonse.body.id}/subjects`
        ));
        expect(subjectResponse.status).toBe(201);
        expect(subjectResponse.body).toHaveProperty("id");
        expect(subjectResponse.body.name.toLowarCase()).toBe("mathematics");
    });
})