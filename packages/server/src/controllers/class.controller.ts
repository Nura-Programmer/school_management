import type { NextFunction, Request, Response } from 'express';
import { createClassSchema, getClassSchema } from '../schemas/class.schema';
import { getPrisma } from '../prisma/getPrisma';
import Errors from '../errors';
import Wrapper from '../middleware/wrapper';

const { withTryCatch } = new Wrapper("School");

export const createClass = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = createClassSchema.safeParse({
      ...req.body,
      schoolId: Number(req.params.schoolId),
   });

   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { name, schoolId } = validatePayload.data;

   const classExist = await prisma.classModel.findFirst({
      where: { name, schoolId },
   });

   if (classExist) return errors.conflict();

   const newClass = await prisma.classModel.create({
      data: { name, schoolId },
   });

   res.status(201).json(newClass);
});

export const updateClass = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const { classId, schoolId } = req.params;
   const { name } = req.body;
   if (!classId || !schoolId || !name) {
      return errors.validation(
         'Both School ID, Class ID and class name are required.'
      );
   }

   const classExist = await prisma.classModel.findFirst({
      where: { id: Number(classId), schoolId: Number(schoolId) },
   });
   if (!classExist) return errors.notFound();

   const updatedClass = await prisma.classModel.update({
      where: { id: Number(classId), schoolId: Number(schoolId) },
      data: { name },
   });

   res.status(200).json(updatedClass);
});

export const deleteClass = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const { classId, schoolId } = req.params;
   if (!classId || !schoolId) {
      return errors.validation('Both School ID and Class ID are required.');
   }

   const classExist = await prisma.classModel.findFirst({
      where: { id: Number(classId), schoolId: Number(schoolId) },
   });
   if (!classExist) return errors.notFound();

   const deletedClass = await prisma.classModel.delete({
      where: { id: Number(classId), schoolId: Number(schoolId) },
   });

   res.status(200).json({ id: deletedClass.id });
});

export const listClasses = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = getClassSchema.safeParse({
      schoolId: Number(req.params.schoolId),
      page: Number(req.query.page),
      limit: Number(req.query.limit),
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { data: validated } = validatePayload;
   const page = Math.max(1, validated.page || 1);
   const limit = Math.max(1, validated.limit || 1);
   const skip = (page - 1) * limit;
   const schoolId = validated.schoolId;

   const classes = await prisma.classModel.findMany({
      where: { schoolId },
      skip,
      take: limit + 1,
      orderBy: { id: 'desc' },
   });

   const hasNext = classes.length > limit;
   if (hasNext) classes.pop();

   res.json({
      data: classes,
      meta: { page, limit, hasNext },
   });
});
