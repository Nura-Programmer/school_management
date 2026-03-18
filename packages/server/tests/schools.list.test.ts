import { describe, it, expect } from "vitest";
import schoolMocks from "./common/schools.mocks";

describe("School listining API", () => {
    const { name, address } = schoolMocks.info;

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
    })
})