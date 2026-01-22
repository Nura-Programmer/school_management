import { describe, expect, it } from "vitest";
import prisma from "../src/prisma/client";

const isMySQL = process.env.DATABASE_PROVIDER === "mysql";

describe.skipIf(!isMySQL)("MySQL smoke tests", () => {
    it("connects to mysql database", async () => {
        const result = await prisma.$queryRawUnsafe("SELECT 1");
        expect(result).toBeDefined();
    });
});