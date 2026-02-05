import prisma from "../../src/prisma/client";
import type { PrismaClient } from "@prisma/client";

let testPrisma: PrismaClient | null = null;

export const beginTest = async () => {
    if (!testPrisma) testPrisma = prisma;

    return testPrisma;
}

export const getTestPrisma = async (): Promise<PrismaClient | void> => {
    if (!testPrisma) {
        throw new Error("Test Prisma not initialized");
    }

    return testPrisma;
}

export const resetTest = async () => {
    if (!testPrisma) return;

    await prisma.school.deleteMany();
    await prisma.teacher.deleteMany();

    testPrisma = null;
}
