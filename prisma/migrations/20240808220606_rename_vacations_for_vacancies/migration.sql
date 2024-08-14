/*
  Warnings:

  - You are about to drop the column `vacations` on the `classrooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classrooms" DROP COLUMN "vacations",
ADD COLUMN     "vacancies" INTEGER NOT NULL DEFAULT 0;
