import type { NextFunction, Request, Response } from "express";
import { getPrisma } from "../prisma/getPrisma";

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    const payload: { name: string } = req.body;
    const classId = Number(req.params.classId)

    const prisma = getPrisma(req);

    const newSubject = await prisma.subject.create({
        data: {
            name: payload.name,
            classId
        }
    });

    res.status(201).json(newSubject);
}