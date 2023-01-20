/*
  Warnings:

  - The values [Agent] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
UPDATE "User" SET "role" = 'StructureManager' WHERE "role" = 'Agent';
CREATE TYPE "UserRole_new" AS ENUM ('Administrator', 'StructureManager', 'Referent', 'Instructor', 'ReceptionAgent');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
UPDATE "User" SET "role" = 'ReceptionAgent' WHERE "role" = 'StructureManager';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
