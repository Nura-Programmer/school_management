import { describe, it, expect } from "vitest"
import request from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";


describe("Teacher listing API", () => {
    it("returns paginated teachers for a school", async () => {
        const schoolRes = await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );

        await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "teacherFirstName1",
                    surname: "teacherSurname1",
                    schoolId: schoolRes.body.id
                })
        );

        await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "teacherFirstName2",
                    surname: "teacherSurname2",
                    schoolId: schoolRes.body.id
                })
        );

        const { status, body } = await request(app).get(`/teachers?schoolId=${schoolRes.body.id}&page=1&limit=1`);

        expect(status).toBe(200);
        expect(body.data.length).toBe(1);
        expect(body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    }
    )
})