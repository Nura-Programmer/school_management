import type { NextFunction, Request, Response } from 'express';
import { createSchoolSchema } from '../schemas/school.schema';
import { getPrisma } from '../prisma/getPrisma';

export const createSchool = async (req: Request, res: Response, next: NextFunction) => {
    const valiadation = createSchoolSchema.safeParse(req.body);

    if (!valiadation.success) {
        return res.status(400).json({
            error: "ValidationError",
            details: valiadation.error.flatten
        });
    }

    const prisma = getPrisma(req);

    try {
        const { name, address } = valiadation.data;

        const school = await prisma.school.create({
            data: {
                name,
                address: address ?? ""
            },
        });

        res.status(201).json(school);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: "Conflict",
                message: "School already exist."
            });
        }

        next(error);
    }
}


export const listSchools = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = getPrisma(req);

    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        const schools = await prisma.school.findMany({
            skip,
            take: limit + 1,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }]
        });

        const hasNext = schools.length > limit;

        if (hasNext) schools.pop();

        res.json({
            data: schools,
            meta: {
                page,
                limit,
                hasNext
            }
        });
    } catch (err) {
        next(err);
    }
}