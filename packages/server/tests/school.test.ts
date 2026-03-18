import { describe, it, expect } from 'vitest';
import schoolMocks from './common/schools.mocks';

describe("School API", () => {
    const { name, address } = schoolMocks.info;

    it("should create a school", async () => {
        const res = await schoolMocks.create({ name, address });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe(name);
    });

    it("returns 400 when payload is empty", async () => {
        const res = await schoolMocks.create({});

        expect(res.status).toBe(400);
    });

    it("returns 400 when name is not a string", async () => {
        const res = await schoolMocks.create({ name: 123 });

        expect(res.status).toBe(400);
    });

    it("returns structured valiadation error when name is empty", async () => {
        const res = await schoolMocks.create({ name: "" });

        expect(res.status).toBe(400);
    });

    it("returns 500 with standard error response on unexpected error", async () => {
        const res = await schoolMocks.getCrash();

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("InternalServerError");
    });

    it("returns 409 when school already exists", async () => {
        const firstResponse = await schoolMocks.create({ name, address });
        expect(firstResponse.status).toBe(201);

        const secondResponse = await schoolMocks.create({ name, address });
        expect(secondResponse.status).toBe(409);
        expect(secondResponse.body.error).toBe("Conflict");
    });

    it("returns paginated schools", async () => {
        const firstSchoolRes = await schoolMocks.create({ name, address });
        expect(firstSchoolRes.body).toHaveProperty("id");

        const secondSchoolRes = await schoolMocks.create({ name: "Second School", address });
        expect(secondSchoolRes.body).toHaveProperty("id");

        const schools = await schoolMocks.getSchools({ page: 1, limit: 1 });
        expect(schools.status).toBe(200);
        expect(schools.body.data.length).toBe(1);
        expect(schools.body.meta).toEqual({
            page: 1,
            limit: 1,
            hasNext: true,
        });
    });
});
