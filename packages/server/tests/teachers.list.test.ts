import { describe, it, expect } from "vitest"
import request from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";

describe("Teacher listing API", () => {
    it("returns paginated teachers for a school", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );

        await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    firstName: "teacherFirstName1",
                    surname: "teacherSurname1"
                })
        );

        await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    firstName: "teacherFirstName2",
                    surname: "teacherSurname2"
                })
        );

        const teachers = await withTestPrisma(
            request(app).get(
                `/api/schools/${school.body.id}/teachers?page=1&limit=1`
            )
        );

        expect(teachers.status).toBe(200);
        expect(teachers.body.data.length).toBe(1);
        expect(teachers.body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    })
})