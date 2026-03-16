import request from "supertest";
import { describe, it, expect } from "vitest";
import { withTestPrisma } from "./helpers/withTestPrisma";
import app from "../src/app";

describe("Class API", () => {
    it("Schould create a class under a school", async () => {
        const { body } = await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "Annur International School",
                    address: "123 Main St, Cityville",
                })
        );

        const response = await withTestPrisma(request
            (app).post(`/schools/${body.id}/classes`)
            .send({
                name: "JSS 1"
            })
        );

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("JSS 1");
    });
})