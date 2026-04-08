import {
   createSubjectSchema,
   deleteSubjectSchema,
   getSubjectsSchema,
   updateSubjectSchema,
} from '../schemas/subject.schema';
import Wrapper from '../middleware/wrapper';

const { withTryCatch } = new Wrapper("Subject");

export const createSubject = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = createSubjectSchema.safeParse({
      schoolId: Number(req.params.schoolId),
      ...req.body,
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { classId, name } = validatePayload.data;

   const subjectExist = await prisma.subject.findFirst({
      where: { classId, name },
   });
   if (subjectExist) return errors.conflict();

   const newSubject = await prisma.subject.create({
      data: { classId, name },
   });

   res.status(201).json(newSubject);
});

export const updateSubject = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = updateSubjectSchema.safeParse({
      subjectId: Number(req.params.subjectId),
      ...req.body,
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { subjectId, name } = validatePayload.data;

   const subjectExist = await prisma.subject.findFirst({
      where: { id: subjectId },
   });
   if (!subjectExist) return errors.notFound();

   const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { name },
   });

   res.status(200).json(updatedSubject);
});

export const deleteSubject = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = deleteSubjectSchema.safeParse({
      subjectId: Number(req.params.subjectId),
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { subjectId } = validatePayload.data;

   const subjectExist = await prisma.subject.findFirst({
      where: { id: subjectId },
   });
   if (!subjectExist) return errors.notFound();

   const deletedSubject = await prisma.subject.delete({
      where: { id: subjectId },
   });

   res.status(200).json({ id: deletedSubject.id });
});

export const getSubjects = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = getSubjectsSchema.safeParse({
      classId: Number(req.params.classId),
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { classId } = validatePayload.data;

   const subjects = await prisma.subject.findMany({
      where: { classId: Number(classId) },
   });

   res.status(200).json(subjects);
});
