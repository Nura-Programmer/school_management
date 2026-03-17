import type { NextFunction, Request, Response } from "express";
import { createClassSchema } from "../schemas/class.schema";
import { getPrisma } from "../prisma/getPrisma";

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
    const validate = createClassSchema.safeParse(req.body);

    if (!validate.success) {
        return res.status(400).json({
            error: "ValidationError",
            details: validate.error.flatten
        });
    }

    const prisma = getPrisma(req);

    try {
        const { name } = validate.data;

        const newClass = await prisma.classModel.create({
            data: {
                name,
                schoolId: Number(req.params.schoolId)
            },
        });

        res.status(201).json(newClass);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: "Conflict",
                message: "Class already exist under this school."
            });
        }

        next(error);
    }
}