import type { NextFunction, Request, Response } from "express";
import { createClassSchema } from "../schemas/class.schema";
import { getPrisma } from "../prisma/getPrisma";
import Errors from "../errors";

export const createClass = async (req: Request, res: Response) => {
    const errors = new Errors(res, "Class");

    try {
        const validatePayload = createClassSchema.safeParse({
            ...req.body, schoolId: Number(req.params.schoolId)
        });

        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { name, schoolId } = validatePayload.data;

        const classExist = await prisma.classModel.findFirst({
            where: { name, schoolId }
        });

        if (classExist) return errors.conflict();

        const newClass = await prisma.classModel.create({
            data: { name, schoolId }
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}

export const listClasses = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = getPrisma(req);

    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 1);
        const skip = (page - 1) * limit;
        const schoolId = Number(req.params.schoolId);

        const classes = await prisma.classModel.findMany({
            where: { schoolId },
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