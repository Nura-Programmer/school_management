import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { withTestPrisma } from "./helpers/withTestPrisma";

describe("School listining API", () => {
    it("returns paginated schools", async () => {
        await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "ASchool", address: "Aschool address"
                })
        );
        await withTestPrisma(
            request(app)
                .post("/api/schools")
                .send({
                    name: "BSchool", address: "Bschool address"
                })
        );

        const schools = await withTestPrisma(request(app).get("/api/schools?page=1&limit=1"));

        expect(schools.status).toBe(200);
        expect(schools.body.data.length).toBe(1);
        expect(schools.body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    })
})