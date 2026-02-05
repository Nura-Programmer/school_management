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
                    name: "A", address: "A"
                })
        );
        await withTestPrisma(
            request(app)
                .post("/schools")
                .send({
                    name: "B", address: "B"
                })
        );

        const res = await request(app).get("/schools?page=1&limit=1");

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.meta).toEqual({
            page: 1,
            limit: 1,
            total: 2,
            pages: 2
        });
    })
})