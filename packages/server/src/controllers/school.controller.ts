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
    } catch (error) {
        next(error);
    }
}


export const listSchools = async (req, res, next) => {
    const prisma = getPrisma(req);

    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.school.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }
            })
        ]);

        res.json({
            data,
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            }
        });
    } catch (err) {
        next(err);
    }
}