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

        const teacher = await prisma.teacher.create({
            data: {
                firstName,
                surname,
                schoolId
            }
        });

        res.status(201).json(teacher);
    } catch (error) {
        next(error);
    }
};
