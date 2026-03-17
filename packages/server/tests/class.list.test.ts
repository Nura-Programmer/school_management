import { describe, expect, it } from "vitest";
import request from "supertest";
import { withTestPrisma } from "./helpers/withTestPrisma";
import type supertest from "supertest";
import app from "../src/app";

describe("Class listing API", () => {
    it("returns paginated classes of a school", async () => {
        const school = await withTestPrisma(
            request(app).post("/api/schools").send({
                name: "Annur Local School",
                address: "address of Local school"
            })
        );

        await withTestPrisma(
            request(app).post(`/api/schools/${school.body.id}/classes`)
            .send({
                name: "Primary 1"
            })
        );

        await withTestPrisma(
            request(app).post(`/api/schools/${school.body.id}/classes`)
            .send({
                name: "Primary 2"
            })
        );

        const classes = await withTestPrisma(request(app).get(
            `/api/schools/${school.body.id}/classes?page=1&limit=1`
        ));

        expect(classes.status).toBe(200);
        expect(classes.body.data.length).toBe(1);
        expect(classes.body.meta).toEqual({
            page: 1, limit: 1, hasNext: true
        });
    });
})