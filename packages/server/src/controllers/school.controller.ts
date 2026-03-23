import type { Request, Response } from 'express';
import { createSchoolSchema } from '../schemas/school.schema';
import { getPrisma } from '../prisma/getPrisma';
import Errors from '../errors';

export const createSchool = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'School');

   try {
      const validatePayload = createSchoolSchema.safeParse(req.body);
      if (!validatePayload.success) {
         return errors.validation(validatePayload.error.message);
      }

      const prisma = getPrisma(req);
      const { name, address } = validatePayload.data;

      const schoolExist = await prisma.school.findFirst({
         where: { name, address },
      });
      if (schoolExist) return errors.conflict();

      const school = await prisma.school.create({
         data: { name, address: address ?? '' },
      });

      res.status(201).json(school);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const updateSchool = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'School');

   try {
      const { name, address } = req.body;
      const schoolId = Number(req.params.schoolId);

      if (!schoolId) return errors.validation('School ID is required.');
      if (!name && !address)
         return errors.validation('Name or Address is required.');

      const prisma = getPrisma(req);
      const schoolExist = await prisma.school.findFirst({
         where: { id: schoolId },
      });

      if (!schoolExist) return errors.notFound();

      const updatedSchool = await prisma.school.update({
         where: { id: schoolId },
         data: { name, address },
      });

      res.status(200).json(updatedSchool);
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const deleteSchool = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'School');

   try {
      const schoolId = Number(req.params.schoolId);
      if (!schoolId) return errors.validation('School ID is required.');

      const prisma = getPrisma(req);
      const schoolExist = await prisma.school.findFirst({
         where: { id: schoolId },
      });

      if (!schoolExist) return errors.notFound();

      const deletedSchool = await prisma.school.delete({
         where: { id: schoolId },
      });

      res.status(200).json({ id: deletedSchool.id });
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};

export const listSchools = async (req: Request, res: Response) => {
   const errors = new Errors(res, 'School');

   try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const skip = (page - 1) * limit;

      const prisma = getPrisma(req);
      const schools = await prisma.school.findMany({
         skip,
         take: limit + 1,
         orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });

      const hasNext = schools.length > limit;

      if (hasNext) schools.pop();

      res.json({
         data: schools,
         meta: {
            page,
            limit,
            hasNext,
         },
      });
   } catch (error) {
      console.error(error);

      return errors.server();
   }
};
