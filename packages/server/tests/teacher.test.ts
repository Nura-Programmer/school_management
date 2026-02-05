import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";

describe("Teacher API", () => {
    it("create a teacher under a school", async () => {
        const schoolRes = await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "Annur Local School",
                    address: "address of Local school"
                })
        );

        const res = await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "teacherFirstName",
                    surname: "teacherSurname",
                    schoolId: schoolRes.body.id
                })
        );

        expect(schoolRes.status).toBe(201);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.firstName).toBe("teacherFirstName");
    });

    it("returns 400 if firstName is missing", async () => {
        const response = await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    surname: "Musa",
                    schoolId: 1
                })
        );

        expect(response.status).toBe(400);
    });

    it("returns 400 if surname is missing", async () => {
        const response = await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "Ali",
                    schoolId: 1
                })
        );

        expect(response.status).toBe(400);
    });

    it("returns 400 if schoolId is missing", async () => {
        const response = await withTestPrisma(
            request(app)
                .post("/teachers")
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
                .post("/teachers")
                .send({
                    firstName: "Ali",
                    surname: "Musa",
                    schoolId: 9999
                })
        );

        expect(response.status).toBe(404);
    });

    it("returns 409 if teacher already exists in the same school", async () => {
        const schoolRes = await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "Annur Tech",
                    address: "address of Tech"
                })
        );

        await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "Ali",
                    surname: "Musa",
                    schoolId: schoolRes.body.id
                })
        );

        const duplicateRes = await withTestPrisma(
            request(app)
                .post("/teachers")
                .send({
                    firstName: "Ali",
                    surname: "Musa",
                    schoolId: schoolRes.body.id
                })
        );

        expect(schoolRes.status).toBe(201);
        expect(duplicateRes.status).toBe(409);
        expect(duplicateRes.body.error).toBe("Conflict");
    });
});
