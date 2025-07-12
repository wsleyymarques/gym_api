/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `gifUrl` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Exercise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `muscleGroup` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Exercise` DROP COLUMN `videoUrl`,
    ADD COLUMN `gifUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `muscleGroup` VARCHAR(191) NOT NULL;
