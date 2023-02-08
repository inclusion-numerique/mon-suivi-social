/*
  Warnings:

  - The values [Other] on the enum `BeneficiaryMobility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BeneficiaryMobility_new" AS ENUM ('PermitWithVehicle', 'PermitWithoutVehicle', 'Code', 'PermitPending', 'OtherPermit', 'PublicTransport', 'BikeOrEquivalent', 'InvalidPermit', 'VehicleWithoutPermit', 'None');
ALTER TABLE "Beneficiary" ALTER COLUMN "mobility" TYPE "BeneficiaryMobility_new" USING ("mobility"::text::"BeneficiaryMobility_new");
ALTER TYPE "BeneficiaryMobility" RENAME TO "BeneficiaryMobility_old";
ALTER TYPE "BeneficiaryMobility_new" RENAME TO "BeneficiaryMobility";
DROP TYPE "BeneficiaryMobility_old";
COMMIT;
