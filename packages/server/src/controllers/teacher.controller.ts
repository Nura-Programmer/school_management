import type { Request, Response } from 'express';
import { getPrisma } from '../prisma/getPrisma';
import Errors from '../errors';
import {
   createTeacherSchema,
   getTeachersSchema,
   updateTeacherSchema,
} from '../schemas/teacher.schema';

export const createTeacher = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Teacher');

   try {
      const validatePayload = createTeacherSchema.safeParse({
         schoolId: Number(req.params.schoolId),
         ...req.body,
      });
      if (!validatePayload.success) {
         return errors.validation(validatePayload.error.message);
      }

      const prisma = getPrisma(req);
      const { firstName, surname, schoolId } = validatePayload.data;

      const school = await prisma.school.findUnique({
         where: { id: Number(schoolId) },
      });
      if (!school) return errors.notFound();

      const teacherExist = await prisma.teacher.findFirst({
         where: { schoolId, firstName, surname },
      });
      if (teacherExist) return errors.conflict();

      const newTeacher = await prisma.teacher.create({
         data: { firstName, surname, schoolId },
      });

      res.status(201).json(newTeacher);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const updateTeacher = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Teacher');
   const { body, params } = req;

   try {
      const validation = updateTeacherSchema.safeParse({
         teacherId: Number(params.teacherId),
         schoolId: Number(params.schoolId),
         ...body,
      });
      if (!validation.success)
         return errors.validation(validation.error.message);

      const { schoolId, teacherId, firstName, surname } = validation.data;
      if (!firstName && !surname) {
         return errors.validation('First name or surname is required.');
      }

      const prisma = getPrisma(req);
      const updatedTeacher = await prisma.teacher.update({
         where: { id: teacherId, schoolId },
         data: { firstName, surname },
      });

      res.status(200).json(updatedTeacher);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const deleteTeacher = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Teacher');

   try {
      const { schoolId, teacherId } = req.params;

      if (!schoolId || !teacherId) {
         return errors.validation(
            "Both School ID and Teacher's ID are required."
         );
      }

      const prisma = getPrisma(req);
      const teacherExist = await prisma.teacher.findFirst({
         where: { id: Number(teacherId), schoolId: Number(schoolId) },
      });

      if (!teacherExist) return errors.notFound();

      const deletedTeacher = await prisma.teacher.delete({
         where: { id: Number(teacherId), schoolId: Number(schoolId) },
      });

      res.status(200).json({ id: deletedTeacher.id });
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const listTeachers = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'Teacher');

   try {
      const validatePayload = getTeachersSchema.safeParse({
         schoolId: Number(req.params.schoolId),
         page: Number(req.query.page),
         limit: Number(req.query.limit),
      });
      if (!validatePayload.success) {
         return errors.validation(validatePayload.error.message);
      }

      const { data: validated } = validatePayload;

      const page = Math.max(1, validated.page || 1);
      const limit = Math.max(1, validated.limit || 10);
      const skip = (page - 1) * limit;

      const prisma = getPrisma(req);
      const teachers = await prisma.teacher.findMany({
         where: { schoolId: validated.schoolId },
         skip,
         take: limit + 1,
         orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });

      const hasNext = teachers.length > limit;
      if (hasNext) teachers.pop();

      res.json({
         data: teachers,
         meta: { page, limit, hasNext },
      });
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};
