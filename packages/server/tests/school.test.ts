import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';
// import prisma from '../src/prisma/client';
import { withTestPrisma } from './helpers/withTestPrisma';

describe("School API", () => {
    it("should create a school", async () => {
        const response = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur International School",
                    address: "123 Main St, Cityville",
                })
        );

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Annur International School");
    });

    it("returns 400 when payload is empty", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({})
        );

        expect(res.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({ name: 123 })
        );

        expect(res.status).toBe(400);
    });

    it("returns structured valiadation error when name is empty", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({ name: "" })
        );

        expect(res.status).toBe(400);
    });

    it("returns 500 with standard error response on unexpected error", async () => {
        const res = await withTestPrisma(
            request(app)
                .get("/api/__test__/crash")
        );

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("InternalServerError");
    });

    it("returns 409 when school already exists", async () => {
        const schoolRes = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({ name: "Duplicate School" })
        );

        expect(schoolRes.status).toBe(201);

        const res = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({ name: "Duplicate School" })
        );

        expect(res.status).toBe(409);
        expect(res.body.error).toBe("Conflict");
    });
});
