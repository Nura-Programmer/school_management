import { CreateMarkSchema, UpdateMarkSchema } from '../schemas/mark.schema';
import Wrapper from '../middleware/wrapper';

const { withTryCatch } = new Wrapper("Marks");

export const createMark = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = CreateMarkSchema.safeParse(req.body);
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { ca, test, exam, studentId, subjectId } = validatePayload.data;

   const markExist = await prisma.mark.findFirst({ where: { studentId, subjectId } });
   if (markExist) return errors.conflict();

   const newMark = await prisma.mark.create({
      data: {
         ca: Number(ca), test: Number(test), exam: Number(exam), studentId, subjectId
      },
   });

   res.status(201).json(newMark);
});

export const updateMark = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res } = handlers;

   const validatePayload = UpdateMarkSchema.safeParse(req.body);
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { ca, test, exam, id } = validatePayload.data;
   const markExist = await prisma.mark.findFirst({ where: { id } });
   if (!markExist) return errors.notFound();

   const updatedMark = await prisma.mark.update({ where: { id }, data: { ca, test, exam } });

   res.status(200).json(updatedMark);
});
