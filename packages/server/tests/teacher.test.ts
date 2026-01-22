import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma/client";

describe("Teacher API", () => {
    it("create a teacher under a school", async () => {
        const res = await request(app)
            .post("/schools")
            .send({
                name: "Annur International School",
                address: "address of inter school"
            }).expect(201);

        const response = await request(app)
            .post("/teachers")
            .send({
                firstName: "Ali",
                surname: "Musa",
                schoolId: res.body.id
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.firstName).toBe("Ali");
    });

    it("returns 400 if firstName is missing", async () => {
        const response = await request(app)
            .post("/teachers")
            .send({
                surname: "Musa",
                schoolId: 1
            });

        expect(response.status).toBe(400);
    });

    it("returns 400 if surname is missing", async () => {
        const response = await request(app)
            .post("/teachers")
            .send({
                firstName: "Ali",
                schoolId: 1
            });

        expect(response.status).toBe(400);
    });

    it("returns 400 if schoolId is missing", async () => {
        const response = await request(app)
            .post("/teachers")
            .send({
                firstName: "Ali",
                surname: "Musa"
            });

        expect(response.status).toBe(400);
    });

    it("returns 404 if school does not exist", async () => {
        const response = await request(app)
            .post("/teachers")
            .send({
                firstName: "Ali",
                surname: "Musa",
                schoolId: 9999
            });

        expect(response.status).toBe(404);
    });
});

afterEach(async () => {
    await prisma.teacher.deleteMany();
    await prisma.school.deleteMany();
});