import {
   createTeacherSchema, getTeachersSchema, updateTeacherSchema,
} from '../schemas/teacher.schema';
import Wrapper from '../middleware/wrapper';
import { hashPassword } from '../utils/hash';

const { withTryCatch } = new Wrapper("School");

export const createTeacher = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;
   const { body, params } = req;

   const validatePayload = createTeacherSchema.safeParse({
      schoolId: params.schoolId,
      ...req.body,
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { firstName, surname, schoolId, username, password } = validatePayload.data;

   const school = await prisma.school.findUnique({
      where: { id: schoolId },
   });
   if (!school) return errors.notFound();

   const teacherExist = await prisma.teacher.findFirst({
      where: { schoolId, username },
   });
   if (teacherExist) return errors.conflict();

   const hashedPassword = await hashPassword(password);
   const newTeacher = await prisma.teacher.create({
      data: { firstName, surname, schoolId, username, password: hashedPassword },
   });

   res.status(201).json(newTeacher);
});

export const updateTeacher = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;
   const { body, params } = req;
   let hasPassword = undefined;

   const validation = updateTeacherSchema.safeParse({
      teacherId: params.teacherId, schoolId: params.schoolId, ...body,
   });
   if (!validation.success)
      return errors.validation(validation.error.message);

   const { schoolId, teacherId, firstName, surname, username, password } = validation.data;
   if (!firstName && !surname && !username && !password) {
      return errors.validation('First name, surname or password is required.');
   }

   if (password) {
      hasPassword = await hashPassword(password);
   }

   const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId, schoolId },
      data: { firstName, surname, password: hasPassword },
   });

   res.status(200).json(updatedTeacher);
});

export const deleteTeacher = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;
   const { schoolId, teacherId } = req.params as { schoolId: string, teacherId: string };

   if (!schoolId || !teacherId) {
      return errors.validation(
         "Both School ID and Teacher's ID are required."
      );
   }

   const teacherExist = await prisma.teacher.findFirst({
      where: { id: teacherId, schoolId: schoolId },
   });

   if (!teacherExist) return errors.notFound();

   const deletedTeacher = await prisma.teacher.delete({
      where: { id: teacherId, schoolId: schoolId },
   });

   res.status(200).json({ id: deletedTeacher.id });
});

export const listTeachers = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const payload = { schoolId: req.params.schoolId } as { schoolId: string, page?: number, limit?: number };
   if (req.query.page) payload.page = +req.query.page;
   if (req.query.limit) payload.limit = +req.query.limit;

   const validatePayload = getTeachersSchema.safeParse(payload);
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { data: validated } = validatePayload;
   const page = Math.max(1, validated.page || 1);
   const limit = Math.max(1, validated.limit || 10);
   const skip = (page - 1) * limit;

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
});
