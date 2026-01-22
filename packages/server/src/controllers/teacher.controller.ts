import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

export const createTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            firstName,
            surname,
            schoolId
        } = req.body;

        if (!firstName || !surname || !schoolId) {
            return res.status(400).json({
                message: "firstName, surname and schoolId are required."
            });
        }

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
