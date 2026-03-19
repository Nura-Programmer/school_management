/*
  Warnings:

  - A unique constraint covering the columns `[name,classType,classId,schoolId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `classes_schoolId_fkey` ON `classes`;

-- DropIndex
DROP INDEX `students_classId_fkey` ON `students`;

-- DropIndex
DROP INDEX `students_schoolId_fkey` ON `students`;

-- DropIndex
DROP INDEX `subjects_classId_fkey` ON `subjects`;

-- DropIndex
DROP INDEX `teachers_schoolId_fkey` ON `teachers`;

-- CreateIndex
CREATE UNIQUE INDEX `students_name_classType_classId_schoolId_key` ON `students`(`name`, `classType`, `classId`, `schoolId`);

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
