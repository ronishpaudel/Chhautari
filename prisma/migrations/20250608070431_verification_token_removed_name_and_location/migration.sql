/*
  Warnings:

  - You are about to drop the column `location` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "location",
DROP COLUMN "name";
