import type { NextFunction, Request, Response } from "express";
import { getPrisma } from "../prisma/getPrisma";

export const createMark = async (req: Request, res: Response, next: NextFunction) => {
    const {
        ca,
        test,
        exam,
        studentId,
        subjectId
    } = req.body;

    const prisma = getPrisma(req);

    const newMark = await prisma.mark.create({
        data: {
            ca,
            test,
            exam,
            studentId,
            subjectId
        }
    });

    res.status(201).json(newMark);
}