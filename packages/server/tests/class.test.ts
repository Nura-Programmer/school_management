import request from "supertest";
import { describe, it, expect } from "vitest";
import { withTestPrisma } from "./helpers/withTestPrisma";
import app from "../src/app";

describe("Class API", () => {
    it("Schould create a class under a school", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur International School",
                    address: "123 Main St, Cityville",
                })
        );

        const response = await withTestPrisma(request
            (app).post(`/api/schools/${school.body.id}/classes`)
            .send({
                name: "JSS 1"
            })
        );

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("JSS 1");
    });

    it("returns 400 when payload is empty", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools/1/classes")
                .send({})
        );

        expect(res.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools/1/classes")
                .send({ name: 123 })
        );

        expect(res.status).toBe(400);
    });

    it("returns structured valiadation error when name is empty", async () => {
        const res = await withTestPrisma(
            request(app)
                .post("/api/schools/1/classes")
                .send({ name: "" })
        );

        expect(res.status).toBe(400);
    });

    it("returns 409 when class already exist under the school", async () => {
        const school = await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "Annur International School",
                    address: "123 Main St, Cityville",
                })
        );

        await withTestPrisma(request
            (app).post(`/api/schools/${school.body.id}/classes`)
            .send({
                name: "Duplicate class"
            })
        );

        const res = await withTestPrisma(request
            (app).post(`/api/schools/${school.body.id}/classes`)
            .send({
                name: "Duplicate class"
            })
        );

        expect(res.status).toBe(409);
        expect(res.body.error).toBe("Conflict");
    });
})