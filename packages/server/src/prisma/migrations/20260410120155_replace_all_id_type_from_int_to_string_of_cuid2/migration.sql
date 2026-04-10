/*
  Warnings:

  - The primary key for the `classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `marks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schools` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teachers` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
DROP INDEX `teachers_schoolId_fkey` ON `teachers`;

-- AlterTable
ALTER TABLE `classes` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    MODIFY `schoolId` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `marks` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    MODIFY `studentId` VARCHAR(30) NOT NULL,
    MODIFY `subjectId` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `schools` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `students` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    MODIFY `classId` VARCHAR(30) NOT NULL,
    MODIFY `schoolId` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `subjects` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    MODIFY `classId` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `teachers` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(30) NOT NULL,
    MODIFY `schoolId` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

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
