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
