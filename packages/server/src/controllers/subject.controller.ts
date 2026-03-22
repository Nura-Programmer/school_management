import type { Request, Response } from "express";
import { getPrisma } from "../prisma/getPrisma";
import { createSubjectSchema, deleteSubjectSchema, getSubjectsSchema, updateSubjectSchema } from "../schemas/subject.schema";
import Errors from "../errors";

export const createSubject = async (req: Request, res: Response) => {
    const errors = new Errors(res, "Subject");

    try {
        const validatePayload = createSubjectSchema.safeParse({
            schoolId: Number(req.params.schoolId),
            ...req.body
        });
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { classId, name } = validatePayload.data;

        const subjectExist = await prisma.subject.findFirst({
            where: { classId, name }
        });
        if (subjectExist) return errors.conflict();

        const newSubject = await prisma.subject.create({
            data: { classId, name }
        });

        res.status(201).json(newSubject);
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}

export const updateSubject = async (req: Request, res: Response) => {
    const errors = new Errors(res, "Subject");

    try {
        const validatePayload = updateSubjectSchema.safeParse({
            subjectId: Number(req.params.subjectId),
            ...req.body
        });
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { subjectId, name } = validatePayload.data;

        const subjectExist = await prisma.subject.findFirst({
            where: { id: subjectId }
        });
        if (!subjectExist) return errors.notFound();

        const updatedSubject = await prisma.subject.update({
            where: { id: subjectId },
            data: { name }
        });

        res.status(200).json(updatedSubject);
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}

export const deleteSubject = async (req: Request, res: Response) => {
    const errors = new Errors(res, "Subject");

    try {
        const validatePayload = deleteSubjectSchema.safeParse({
            subjectId: Number(req.params.subjectId)
        });
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const prisma = getPrisma(req);
        const { subjectId } = validatePayload.data;

        const subjectExist = await prisma.subject.findFirst({
            where: { id: subjectId }
        });
        if (!subjectExist) return errors.notFound();

        const deletedSubject = await prisma.subject.delete({
            where: { id: subjectId }
        });

        res.status(200).json({ id: deletedSubject.id });
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}

export const getSubjects = async (req: Request, res: Response) => {
    const errors = new Errors(res, "Subject");

    try {
        const validatePayload = getSubjectsSchema.safeParse({
            classId: Number(req.params.classId),

        });
        if (!validatePayload.success) {
            return errors.validation(validatePayload.error.message);
        }

        const { classId } = validatePayload.data;
        const prisma = getPrisma(req);

        const subjects = await prisma.subject.findMany({
            where: { classId: Number(classId) }
        });

        res.status(200).json(subjects);
    } catch (error) {
        console.error(error);

        return errors.server();
    }
}