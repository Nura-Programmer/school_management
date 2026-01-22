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
