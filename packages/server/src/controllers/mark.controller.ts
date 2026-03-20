import type { NextFunction, Request, Response } from "express";
import { getPrisma } from "../prisma/getPrisma";
import { CreateMarkSchema } from "../schemas/mark.schema";

export const createMark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatePayload = CreateMarkSchema.safeParse(req.body);

        if (!validatePayload.success) {
            return res.status(400).json({
                error: "ValidationError",
                message: validatePayload.error.flatten
            });
        }

        const prisma = getPrisma(req);
        const {
            ca,
            test,
            exam,
            studentId,
            subjectId
        } = validatePayload.data;

        const newMark = await prisma.mark.create({
            data: {
                ca: Number(ca),
                test: Number(test),
                exam: Number(exam),
                studentId,
                subjectId
            }
        });

        res.status(201).json(newMark);
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Conflict",
                message: "Mark already recorded."
            });
        }

        next(error);
    }
}