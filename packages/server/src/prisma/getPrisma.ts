import type { Request } from "express";
import prisma from "./client";

export function getPrisma(req?: Request & { prisma?: typeof prisma }) {
    return req?.prisma ?? prisma;
}

