/*
  Warnings:

  - A unique constraint covering the columns `[firstName,surname,schoolId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Teacher_firstName_surname_schoolId_key" ON "Teacher"("firstName", "surname", "schoolId");
