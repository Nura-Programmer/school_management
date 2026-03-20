import type { NextFunction, Request, Response } from 'express';
import { createSchoolSchema } from '../schemas/school.schema';
import { getPrisma } from '../prisma/getPrisma';
import Errors from '../errors';

export const createSchool = async (req: Request, res: Response) => {
    const errors = new Errors(res, "School");

    try {
        const validatePayload = createSchoolSchema.safeParse(req.body);
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { name, address } = validatePayload.data;

        const schoolExist = await prisma.school.findFirst({
            where: { name, address }
        });
        if (schoolExist) return errors.conflict();

        const school = await prisma.school.create({
            data: { name, address: address ?? "" }
        });

        res.status(201).json(school);
    } catch (error) {
        console.error(error)

        return errors.server();
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