import prisma from "../../src/prisma/client";
import type { Prisma } from "@prisma/client";

let testPrisma: Prisma.TransactionClient | null = null;
let rollback!: () => void;

export const beginTestTransaction = async () => {
    await prisma.$transaction(async (client) => {
        testPrisma = client;

        await new Promise<void>((_, reject) => {
            rollback = () => reject(new Error("RollBack"));
        });
    }).catch(() => {
        // Transaction rolled back
    });
}

export const getTestPrisma = (): Prisma.TransactionClient => {
    if (!testPrisma) {
        throw new Error("Test transaction has not initialized.");
    }

    return testPrisma;
}

export const rollbackTestTransaction = async () => {
    rollback();
    testPrisma = null;
}
