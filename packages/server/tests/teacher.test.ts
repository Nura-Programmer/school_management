import { describe, it, expect } from "vitest";
import request, { type Test } from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";

describe("Teacher API", async () => {

    it("create a teacher under a school", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );
        const res = await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    firstName: "teacherFirstName",
                    surname: "teacherSurname"
                })
        );

        expect(school.status).toBe(201);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.firstName).toBe("teacherFirstName");
    });

    it("returns 400 if firstName is missing", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );
        const response = await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    surname: "Musa",
                    schoolId: school.body.id
                })
        );

        expect(response.status).toBe(400);
    });

    it("returns 400 if surname is missing", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );

        const response = await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    firstName: "Ali",
                    schoolId: school.body.id
                })
        );

        expect(response.status).toBe(400);
    });

    it("returns 400 if schoolId is missing", async () => {
        const response = await withTestPrisma(
            request(app)
                .post(`/api/schools/ /teachers`)
                .send({
                    firstName: "Ali",
                    surname: "Musa"
                })
        );

        expect(response.status).toBe(400);
    });

    it("returns 404 if school does not exist", async () => {
        const response = await withTestPrisma(
            request(app)
                .post(`/api/schools/999/teachers`)
                .send({
                    firstName: "Ali",
                    surname: "Musa"
                })
        );

        expect(response.status).toBe(404);
    });

    it("returns 409 if teacher already exists in the same school", async () => {
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
                    firstName: "Ali",
                    surname: "Musa"
                })
        );

        const duplicateRes = await withTestPrisma(
            request(app)
                .post(`/api/schools/${school.body.id}/teachers`)
                .send({
                    firstName: "Ali",
                    surname: "Musa"
                })
        );

        expect(duplicateRes.status).toBe(409);
        expect(duplicateRes.body.error).toBe("Conflict");
    });
});
