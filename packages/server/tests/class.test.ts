import { describe, it, expect } from 'vitest';
import schoolMocks from './common/schools.mocks';
import classMocks from './common/classes.mocks';

describe('Class API', () => {
   const { info: schoolInfo } = schoolMocks;
   const { info: classInfo } = classMocks;

   it('Schould create a class under a school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;


      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id
      });

      console.log(school, classResponse.body)
      expect(classResponse.status).toBe(201);
      expect(classResponse.body).toHaveProperty('id');
      expect(classResponse.body.name).toBe(classInfo.name);
   });

   it('returns 400 when payload is empty', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({ schoolId: school.id });
      expect(classResponse.status).toBe(400);
   });

   it('returns 400 when name is not a string', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         schoolId: school.id, name: 123,
      });
      expect(classResponse.status).toBe(400);
   });

   it('returns structured valiadation error when name is empty', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         schoolId: school.id, name: '',
      });
      expect(classResponse.status).toBe(400);
   });

   it('returns 409 when class already exist under the school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const firstClass = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });
      const secondClass = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      expect(secondClass.status).toBe(409);
      expect(secondClass.body.error).toBe('Conflict');
   });

   it('returns paginated classes of a school', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const firstClass = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const secondClass = await classMocks.create({
         schoolId: school.id, name: 'JSS 2',
      });

      const classes = await classMocks.getClasses({
         schoolId: school.id, page: 1, limit: 1,
      });

      expect(classes.status).toBe(200);
      expect(classes.body.data.length).toBe(1);
      expect(classes.body.meta).toEqual({
         page: 1, limit: 1, hasNext: true,
      });
   });

   it('should update a class', async () => {
      const newName = 'updatedName';
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const { id: classId, schoolId } = classResponse.body;
      const updatedName = await classMocks.update({
         id: classId, schoolId, name: newName,
      });

      expect(updatedName.body.name, 'to update class name').toBe(newName);
   });

   it('should delete a class', async () => {
      const response = await schoolMocks.create(schoolInfo);
      const { school } = response.body;

      const classResponse = await classMocks.create({
         ...classInfo, schoolId: school.id,
      });

      const { id: classId, schoolId } = classResponse.body;
      const deletedClass = await classMocks.delete(classId, schoolId);

      expect(deletedClass.status).toBe(200);
      expect(deletedClass.body.id).toBe(classId);
   });
});
