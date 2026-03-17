import type { Request, Response, NextFunction } from "express";
import { getPrisma } from "../prisma/getPrisma";

export const createTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { firstName, surname } = req.body;
        const schoolId = Number(req.params.schoolId);

        if (!firstName || !surname || !schoolId) {
            return res.status(400).json({
                message: "firstName, surname and schoolId are required."
            });
        }

        const prisma = getPrisma(req);

        const school = await prisma.school.findUnique({
            where: { id: Number(schoolId) }
        });

        if (!school) {
            return res.status(404).json({
                error: "NotFound",
                message: "School not found"
            });
        }

        const teacher = await prisma.teacher.create({
            data: {
                firstName,
                surname,
                schoolId
            }
        });

        res.status(201).json(teacher);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: "Conflict",
                message: "Teacher already exists in this school"
            });
        }

        next(error);
    }
};

export const listTeachers = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = getPrisma(req);

    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                error: "ValidationError",
                message: "schoolId query parameter is required."
            });
        }

        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        const teachers = await prisma.teacher.findMany({
            where: {
                schoolId: Number(schoolId)
            },
            skip,
            take: limit + 1,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }]
        });

        const hasNext = teachers.length > limit;
        if (hasNext) teachers.pop();

        res.json({
            data: teachers,
            meta: {
                page,
                limit,
                hasNext
            }
        });
    } catch (error: any) {
        next(error);
    }
};