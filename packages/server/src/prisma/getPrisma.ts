import prisma from "./client";

export const getPrisma = (req?: any) => {
    return req?.testPrisma ?? prisma;
}

