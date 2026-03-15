import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";

describe("School listining API", () => {
    it("returns paginated schools", async () => {
        await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "ASchool", address: "Aschool address"
                })
        );
        await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "BSchool", address: "Bschool address"
                })
        );

        const { status, body } = await withTestPrisma(request(app).get("/schools?page=1&limit=1"));

        expect(status).toBe(200);
        expect(body.data.length).toBe(1);
        expect(body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    })
})