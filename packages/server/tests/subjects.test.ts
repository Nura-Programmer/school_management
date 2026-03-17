import request from "supertest";
import { describe, expect, it } from "vitest";
import { withTestPrisma } from "./helpers/withTestPrisma";
import app from "../src/app";

describe("Subjects API", () => {
    it("create subject under a specific class in a school", async ()=> {
        const school = await withTestPrisma(request(app).post("/api/schools").send({
            name: "Annur Local School",
            address: "School address"
        }));

        const classResonse = await withTestPrisma(request(app).post(`/api/schools/${school.body.id}/classes`).send({
            name: "SS 1"
        }));

        const subjectResponse = await withTestPrisma(request(app).post(
            `/api/schools/${school.body.id}/classes/${classResonse.body.id}/subjects`
        ));

        expect(school.body).toHaveProperty("id");
        expect(classResonse.body).toHaveProperty("id");
        expect(subjectResponse.status).toBe(201);
        expect(subjectResponse.body).toHaveProperty("id");
        expect(subjectResponse.body.name).toBe("SS 1");
    })
})