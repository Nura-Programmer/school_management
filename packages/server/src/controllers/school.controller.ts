import { createSchoolSchema } from '../schemas/school.schema';
import Wrapper from '../middleware/wrapper';

const { withTryCatch } = new Wrapper("School");

export const createSchool = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const validatePayload = createSchoolSchema.safeParse(req.body);
   if (!validatePayload.success) {
      return errors.validation(validatePayload.error.message);
   }

   const { name, code, town, address } = validatePayload.data;
   const schoolExist = await prisma.school.findFirst({
      where: { name, code, town, address },
   });
   if (schoolExist) return errors.conflict();

   const school = await prisma.school.create({
      data: { name, code, town, address: address ?? '' },
   });

   res.status(201).json(school);
})

export const updateSchool = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;
   const { name, code, town, address } = req.body;
   const schoolId = Number(req.params.schoolId);

   if (!schoolId) return errors.validation('School ID is required.');
   if (!name && !address)
      return errors.validation('Name or Address is required.');

   const schoolExist = await prisma.school.findFirst({
      where: { id: schoolId },
   });

   if (!schoolExist) return errors.notFound();

   const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: { name, code, town, address },
   });

   res.status(200).json(updatedSchool);
});

export const deleteSchool = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;
   const schoolId = Number(req.params.schoolId);
   if (!schoolId) return errors.validation('School ID is required.');

   const schoolExist = await prisma.school.findFirst({
      where: { id: schoolId },
   });

   if (!schoolExist) return errors.notFound();

   const deletedSchool = await prisma.school.delete({
      where: { id: schoolId },
   });

   res.status(200).json({ id: deletedSchool.id });

});

export const listSchools = withTryCatch(async (handlers, prisma, errors) => {
   const { req, res, next } = handlers;

   const page = Math.max(1, parseInt(req.query.page as string) || 1);
   const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
   const skip = (page - 1) * limit;

   const schools = await prisma.school.findMany({
      skip,
      take: limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
   });

   const hasNext = schools.length > limit;

   if (hasNext) schools.pop();

   res.json({
      data: schools,
      meta: { page, limit, hasNext }
   });
});
