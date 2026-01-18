import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';

describe("School API", () => {
    it("should create a school", async () => {
        const response = await (request(app) as any)
            .post("/schools")
            .send({
                name: "Annur International School",
                address: "123 Main St, Cityville",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Annur International School");
    });
});
