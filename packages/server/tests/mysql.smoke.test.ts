import { describe, expect, it } from "vitest";
import prisma from "../src/prisma/client";

describe("MySQL smoke tests", () => {
    it("connects to mysql database", async () => {
        const result = await prisma.$queryRawUnsafe("SELECT 1 + 1 AS three");
        expect(result).toBeDefined();
    });
});