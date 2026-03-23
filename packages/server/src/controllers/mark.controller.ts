import type { Request, Response } from 'express';
import { getPrisma } from '../prisma/getPrisma';
import { CreateMarkSchema, UpdateMarkSchema } from '../schemas/mark.schema';
import Errors from '../errors';

export const createMark = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Mark');

   try {
      const validatePayload = CreateMarkSchema.safeParse(req.body);
      if (!validatePayload.success) {
         return errors.validation(validatePayload.error.message);
      }

      const prisma = getPrisma(req);
      const { ca, test, exam, studentId, subjectId } = validatePayload.data;

      const markExist = await prisma.mark.findFirst({
         where: { studentId, subjectId },
      });
      if (markExist) return errors.conflict();

      const newMark = await prisma.mark.create({
         data: {
            ca: Number(ca),
            test: Number(test),
            exam: Number(exam),
            studentId,
            subjectId,
         },
      });

      res.status(201).json(newMark);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const updateMark = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Mark');

   try {
      const validatePayload = UpdateMarkSchema.safeParse(req.body);
      if (!validatePayload.success) {
         return errors.validation(validatePayload.error.message);
      }

      const prisma = getPrisma(req);
      const { ca, test, exam, id } = validatePayload.data;

      const markExist = await prisma.mark.findFirst({
         where: { id },
      });
      if (!markExist) return errors.notFound();

      const updatedMark = await prisma.mark.update({
         where: { id },
         data: { ca, test, exam },
      });

      res.status(200).json(updatedMark);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};
