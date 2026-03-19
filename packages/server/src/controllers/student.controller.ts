import type { NextFunction, Request, Response } from "express"
import { getPrisma } from "../prisma/getPrisma";

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const {name, classType} = req.body;
    const schoolId = Number(params.schoolId);
    const classId = Number(params.classId);

    const prisma = getPrisma(req);

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