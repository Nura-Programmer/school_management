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

export const listClasses = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = getPrisma(req);

    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 1);
        const skip = (page - 1) * limit;

        const classes = await prisma.classModel.findMany({
            skip, take: limit + 1, orderBy: [
                { id: "desc" }
            ]
        });

        const hasNext = classes.length > limit;

        if (hasNext) classes.pop();

        res.json({
            data: classes,
            meta: {
                page, limit, hasNext
            }
        });
    } catch (err) {
        next(err)
    }
}