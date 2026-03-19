import type { NextFunction, Request, Response } from "express"
import { getPrisma } from "../prisma/getPrisma";
import { createStudentSchema } from "../schemas/student.schema";

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { params, body } = req;
    const validatePayload = createStudentSchema.safeParse({ ...req.params, ...req.body });

    if (!validatePayload.success) {
        return res.status(400).json({
            error: "ValidationError",
            details: validatePayload.error?.flatten
        });
    }

    const prisma = getPrisma(req);
    const { name, classType, classId, schoolId } = validatePayload.data;

    const newStudent = await prisma.student.create({
        data: {
            classId,
            classType,
            schoolId,
            name
        }
    });

    return res.status(201).json(newStudent);

}