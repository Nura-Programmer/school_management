import type { NextFunction, Request, Response } from "express";
import { getPrisma } from "../prisma/getPrisma";
import { createSubjectSchema } from "../schemas/subject.schema";

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatePayload = createSubjectSchema.safeParse(req.body);
        const schoolId = Number(req.params.schoolId);

        if (!validatePayload.success || !schoolId) {
            return res.status(400).json({
                error: "ValidationError",
                details: validatePayload.error?.flatten
            });
        }

        const prisma = getPrisma(req);
        const { classId, name } = validatePayload.data;

        const newSubject = await prisma.subject.create({
            data: { classId, name }
        });

        res.status(201).json(newSubject);
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Conflict",
                message: "Subject already exist under this class."
            });
        }

        next(error);
    }
}

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    const { schoolId, classId } = req.params;

    const prisma = getPrisma(req);

    const subjects = await prisma.subject.findMany({
        where: {
            classId: Number(classId)
        }
    });

    res.status(200).json(subjects);
}