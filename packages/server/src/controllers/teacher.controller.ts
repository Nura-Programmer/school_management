import type { Request, Response, NextFunction } from "express";
import { getPrisma } from "../prisma/getPrisma";
import Errors from "../errors";
import { createTeacherSchema } from "../schemas/teacher.schema";

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
    const errors = new Errors(res, "Teacher");

    try {
        const validatePayload = createTeacherSchema.safeParse({
            schoolId: Number(req.params.schoolId),
            ...req.body
        });
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { firstName, surname, schoolId } = validatePayload.data;

        const school = await prisma.school.findUnique({
            where: { id: Number(schoolId) }
        });
        if (!school) return errors.notFound();

        const teacherExist = await prisma.teacher.findFirst({
            where: { schoolId, firstName, surname }
        });
        if (teacherExist) return errors.conflict();

        const newTeacher = await prisma.teacher.create({
            data: { firstName, surname, schoolId }
        });

        res.status(201).json(newTeacher);
    } catch (error) {
        console.error(error);

        return errors.server();
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