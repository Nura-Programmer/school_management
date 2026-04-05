/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,schoolId]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `classes_schoolId_fkey` ON `classes`;

-- DropIndex
DROP INDEX `marks_subjectId_fkey` ON `marks`;

-- DropIndex
DROP INDEX `students_classId_fkey` ON `students`;

-- DropIndex
DROP INDEX `students_schoolId_fkey` ON `students`;

-- DropIndex
DROP INDEX `subjects_classId_fkey` ON `subjects`;

-- DropIndex
DROP INDEX `teachers_firstName_surname_schoolId_key` ON `teachers`;

-- DropIndex
DROP INDEX `teachers_schoolId_fkey` ON `teachers`;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `code` VARCHAR(8) NOT NULL,
    ADD COLUMN `town` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `username` VARCHAR(40) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `schools_code_key` ON `schools`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `teachers_username_key` ON `teachers`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `teachers_username_schoolId_key` ON `teachers`(`username`, `schoolId`);

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
