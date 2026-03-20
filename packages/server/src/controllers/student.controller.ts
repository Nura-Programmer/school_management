import type { NextFunction, Request, Response } from "express"
import { getPrisma } from "../prisma/getPrisma";
import { createStudentSchema } from "../schemas/student.schema";
import Errors from "../errors";

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    const errors = new Errors(res, "Student");

    try {
        const validatePayload = createStudentSchema.safeParse(req.body);
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { name, classType, classId, schoolId } = validatePayload.data;

        const studentExist = await prisma.student.findFirst({
            where: { schoolId, classId, classType, name }
        });
        if (studentExist) return errors.conflict();

        const newStudent = await prisma.student.create({
            data: { classId, classType, schoolId, name }
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}

export const getAllStudents = async (req: Request, res: Response) => {
    const prisma = getPrisma(req);
    const schoolId = Number(req.params.schoolId);

    const students = await prisma.student.findMany({
        where: {
            schoolId
        }
    });

    res.status(200).json(students);
}