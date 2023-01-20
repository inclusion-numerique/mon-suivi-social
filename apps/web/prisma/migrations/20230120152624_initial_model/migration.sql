-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Disabled');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Administrator', 'StructureManager', 'Referent', 'Instructor', 'ReceptionAgent');

-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('Ccas', 'Cias', 'Commune', 'Association', 'Ministere');

-- CreateEnum
CREATE TYPE "FollowupTypeType" AS ENUM ('Legal', 'Optional');

-- CreateEnum
CREATE TYPE "FollowupMedium" AS ENUM ('PlannedInPerson', 'UnplannedInPerson', 'PhoneCall', 'BeneficiaryHouseAppointment', 'ExternalAppointment', 'PostalMail', 'Email', 'Videoconference', 'ThirdParty');

-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('InProgress', 'Done');

-- CreateEnum
CREATE TYPE "HelpRequestStatus" AS ENUM ('WaitingForDocuments', 'WaitingForDecision', 'Accepted', 'Denied');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('WireTransfer', 'CreditCard', 'Cash', 'Check', 'FoodStamps');

-- CreateEnum
CREATE TYPE "HelpRequestReason" AS ENUM ('Energy', 'Food', 'Housing');

-- CreateEnum
CREATE TYPE "BeneficiaryStatus" AS ENUM ('Active', 'Inactive', 'Archived', 'Deceased');

-- CreateEnum
CREATE TYPE "BeneficiaryTitle" AS ENUM ('Mister', 'Miss');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryAccomodationMode" AS ENUM ('None', 'Owner', 'SocialRenting', 'PrivateRenting', 'Fortune', 'EmergencyHousing', 'Other', 'ThirdPerson', 'Parents', 'Substandard', 'NursingHome');

-- CreateEnum
CREATE TYPE "BeneficiaryFamilySituation" AS ENUM ('Married', 'Single', 'Widow', 'Cohabitation', 'CivilUnion', 'CoupleWithChildren', 'Divorced', 'Separated', 'SingleParentWithChildren', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryMobility" AS ENUM ('PermitWithVehicle', 'PermitWithoutVehicle', 'Code', 'PermitPending', 'OtherPermit', 'PublicTransport', 'BikeOrEquivalent', 'InvalidPermit', 'VehicleWithoutPermit', 'Other');

-- CreateEnum
CREATE TYPE "BeneficiaryGir" AS ENUM ('Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6');

-- CreateEnum
CREATE TYPE "BeneficiarySocioProfessionalCategory" AS ENUM ('Employed', 'Retired', 'JobSeeker', 'Disability', 'SickLeave', 'Housewife', 'NoActivity', 'Other');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('Rsa', 'PrimeActivite', 'PrestationsFamiliales', 'IndemnitesPoleEmploi', 'Salaire', 'Retraite', 'Aspa', 'PensionInvalidite', 'IndemnitesJournalieres', 'Aah', 'Apl', 'Autre');

-- CreateEnum
CREATE TYPE "BeneficiaryProtectionMeasure" AS ENUM ('Tutelle', 'CuratelleSimple', 'CuratelleRenforcee', 'SauvegardeDeJustice', 'HabilitationDuConjoint', 'HabilitationFamiliale', 'MesureAccompagnement', 'MandatDeProtectionFuture');

-- CreateEnum
CREATE TYPE "BeneficiaryOrientationType" AS ENUM ('Spontanee', 'Elu', 'Departement', 'Association', 'Tiers', 'SuiviCabinet', 'Autre');

-- CreateEnum
CREATE TYPE "RelativeRelationship" AS ENUM ('Conjoint', 'EnfantMineur', 'EnfantMajeur', 'Parent', 'Grandparent', 'Neighbour', 'Fratrie', 'Tiers', 'AutreMemberDeLaFamille');

-- CreateEnum
CREATE TYPE "MutationSource" AS ENUM ('User', 'Admin', 'System');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "location" TEXT,
    "title" TEXT,
    "description" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organisationId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" UUID NOT NULL,
    "type" "OrganisationType" NOT NULL,
    "name" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowupType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FollowupTypeType" NOT NULL,
    "default" BOOLEAN NOT NULL,

    CONSTRAINT "FollowupType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followup" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "medium" "FollowupMedium" NOT NULL,
    "date" DATE NOT NULL,
    "typeId" UUID NOT NULL,
    "synthesis" TEXT,
    "status" "FollowupStatus" NOT NULL,
    "privateSynthesis" TEXT,
    "helpRequested" BOOLEAN,
    "place" TEXT,
    "redirected" BOOLEAN,
    "organisationName" TEXT,
    "dueDate" DATE,
    "thirdPersonName" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "openingDate" DATE NOT NULL,
    "typeId" UUID NOT NULL,
    "financialSupport" BOOLEAN NOT NULL,
    "externalOrganisation" BOOLEAN NOT NULL,
    "status" "HelpRequestStatus" NOT NULL,
    "askedAmount" DECIMAL(65,30),
    "examinationDate" DATE,
    "decisionDate" DATE,
    "allocatedAmount" DECIMAL(65,30),
    "paymentMethod" "PaymentMethod",
    "paymentDate" DATE,
    "handlingDate" DATE,
    "refusalReason" TEXT,
    "examiningOrganisation" TEXT,
    "dispatchDate" DATE,
    "synthesis" TEXT,
    "privateSynthesis" TEXT,
    "dueDate" DATE,
    "fullFile" BOOLEAN,
    "reason" "HelpRequestReason",
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "aidantConnectAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "fileNumber" TEXT NOT NULL,
    "status" "BeneficiaryStatus" NOT NULL,
    "title" "BeneficiaryTitle",
    "usualName" TEXT,
    "birthName" TEXT,
    "firstName" TEXT,
    "birthDate" DATE,
    "birthPlace" TEXT,
    "deathDate" DATE,
    "gender" "Gender",
    "nationality" TEXT,
    "accomodationMode" "BeneficiaryAccomodationMode",
    "accomodationName" TEXT,
    "accomodationAdditionalInformation" TEXT,
    "street" TEXT,
    "streetNumber" TEXT,
    "addressComplement" TEXT,
    "zipcode" TEXT,
    "city" TEXT,
    "noPhone" BOOLEAN,
    "phone1" TEXT,
    "phone2" TEXT,
    "email" TEXT,
    "familySituation" "BeneficiaryFamilySituation",
    "caregiver" BOOLEAN,
    "minorChildren" INTEGER,
    "majorChildren" INTEGER,
    "mobility" "BeneficiaryMobility",
    "administration" TEXT,
    "minister" TEXT,
    "gir" "BeneficiaryGir",
    "doctor" TEXT,
    "healthAdditionalInformation" TEXT,
    "socialSecurityNumber" TEXT,
    "insurance" TEXT,
    "socioProfessionalCategory" "BeneficiarySocioProfessionalCategory",
    "occupation" TEXT,
    "employer" TEXT,
    "employerSiret" TEXT,
    "mainIncomeSource" "IncomeSource"[],
    "mainIncomeAmount" DECIMAL(65,30),
    "partnerMainIncomeSource" "IncomeSource"[],
    "partnerMainIncomeAmount" DECIMAL(65,30),
    "majorChildrenMainIncomeSource" "IncomeSource"[],
    "majorChildrenMainIncomeAmount" DECIMAL(65,30),
    "unemploymentNumber" TEXT,
    "pensionOrganisation" TEXT,
    "cafNumber" TEXT,
    "bank" TEXT,
    "funeralContract" TEXT,
    "protectionMeasure" "BeneficiaryProtectionMeasure",
    "representative" TEXT,
    "prescribingOrganisation" TEXT,
    "orientationType" "BeneficiaryOrientationType",
    "orientationOrganisation" TEXT,
    "serviceProviders" TEXT,
    "involvedPartners" TEXT,
    "additionalInformation" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeneficiaryRelative" (
    "id" UUID NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "relationship" "RelativeRelationship",
    "city" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "hosted" BOOLEAN,
    "caregiver" BOOLEAN,
    "beneficiaryId" UUID NOT NULL,
    "additionalInformation" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeneficiaryRelative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "token" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "MutationLog" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" "MutationSource" NOT NULL,
    "byId" UUID,
    "aggregateId" UUID,
    "data" JSONB NOT NULL,

    CONSTRAINT "MutationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FollowupTypeToOrganisation" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FollowupType_name_key" ON "FollowupType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_fileNumber_key" ON "Beneficiary"("fileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_FollowupTypeToOrganisation_AB_unique" ON "_FollowupTypeToOrganisation"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowupTypeToOrganisation_B_index" ON "_FollowupTypeToOrganisation"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FollowupType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FollowupType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeneficiaryRelative" ADD CONSTRAINT "BeneficiaryRelative_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_byId_fkey" FOREIGN KEY ("byId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupTypeToOrganisation" ADD CONSTRAINT "_FollowupTypeToOrganisation_A_fkey" FOREIGN KEY ("A") REFERENCES "FollowupType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupTypeToOrganisation" ADD CONSTRAINT "_FollowupTypeToOrganisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
