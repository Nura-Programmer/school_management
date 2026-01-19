import type { Request, Response } from 'express';
import prisma from '../prisma/client';
import { createSchoolSchema } from '../schemas/school.schema';

export const createSchool = async (req: Request, res: Response) => {
    const valiadation = createSchoolSchema.safeParse(req.body);

    if (!valiadation.success) {
        return res.status(400).json({
            error: "ValidationError",
            details: valiadation.error.flatten
        });
    }

    const { name, address } = valiadation.data;

    const school = await prisma.school.create({
        data: {
            name,
            address: address ?? ""
        },
    });

    res.status(201).json(school);
}
