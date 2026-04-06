import { getPrisma } from '../prisma/getPrisma';
import {
   createStudentSchema,
   deleteStudentSchema,
   getStudentsSchema,
   updateStudentSchema,
} from '../schemas/student.schema';
import Wrapper from '../middleware/wrapper';

const { withTryCatch } = new Wrapper("Student");

export const createStudent = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = createStudentSchema.safeParse(req.body);
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { name, classType, classId, schoolId } = validatePayload.data;

   const studentExist = await prisma.student.findFirst({
      where: { schoolId, classId, classType, name },
   });
   if (studentExist) return errors.conflict();

   const newStudent = await prisma.student.create({
      data: { classId, classType, schoolId, name },
   });

   res.status(201).json(newStudent);
});

export const updateStudent = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = updateStudentSchema.safeParse({
      studentId: Number(req.params.studentId),
      ...req.body,
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { studentId, name } = validatePayload.data;

   const studentExist = await prisma.student.findFirst({
      where: { id: studentId },
   });
   if (!studentExist) return errors.notFound();

   const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { name },
   });

   res.status(200).json(updatedStudent);
});

export const deleteStuent = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = deleteStudentSchema.safeParse({
      studentId: Number(req.params.studentId),
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { studentId } = validatePayload.data;

   const studentExist = await prisma.student.findFirst({
      where: { id: studentId },
   });
   if (!studentExist) return errors.notFound();

   const deletedStudent = await prisma.student.delete({
      where: { id: studentId },
   });

   res.status(200).json({ id: deletedStudent.id });
});

export const getAllStudents = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = getStudentsSchema.safeParse({
      schoolId: Number(req.params.schoolId),
   });
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { schoolId } = validatePayload.data;

   const students = await prisma.student.findMany({
      where: { schoolId },
   });

   res.status(200).json(students);
});
