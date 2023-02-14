-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Disabled');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Administrator', 'StructureManager', 'SocialWorker', 'Instructor', 'ReceptionAgent', 'Referent');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('Ccas', 'Cias', 'Commune', 'Association', 'Ministere');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Cerfa', 'HistoriqueCourrier', 'Justificatifs', 'Rapports');

-- CreateEnum
CREATE TYPE "FollowupMedium" AS ENUM ('PlannedInPerson', 'UnplannedInPerson', 'PhoneCall', 'BeneficiaryHouseAppointment', 'ExternalAppointment', 'PostalMail', 'Email', 'Videoconference', 'ThirdParty');

-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('Todo', 'InProgress', 'Done');

-- CreateEnum
CREATE TYPE "HelpRequestStatus" AS ENUM ('WaitingAdditionalInformation', 'InvestigationOngoing', 'Accepted', 'Refused', 'Adjourned', 'ClosedByBeneficiary', 'Dismissed');

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
CREATE TYPE "BeneficiaryMobility" AS ENUM ('PermitWithVehicle', 'PermitWithoutVehicle', 'Code', 'PermitPending', 'OtherPermit', 'PublicTransport', 'BikeOrEquivalent', 'InvalidPermit', 'VehicleWithoutPermit', 'None');

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
CREATE TYPE "RelativeRelationship" AS ENUM ('Conjoint', 'EnfantMineur', 'EnfantMajeur', 'Parent', 'Grandparent', 'Neighbour', 'Sibling', 'Tiers', 'AutreMemberDeLaFamille');

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
    "structureId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" UUID NOT NULL,
    "type" "StructureType" NOT NULL,
    "name" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "size" INTEGER NOT NULL,
    "tags" TEXT[],
    "confidential" BOOLEAN NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "FollowupType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "legallyRequired" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID,
    "ownedByStructureId" UUID,

    CONSTRAINT "FollowupType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposedFollowupType" (
    "structureId" UUID NOT NULL,
    "followupTypeId" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposedFollowupType_pkey" PRIMARY KEY ("structureId","followupTypeId")
);

-- CreateTable
CREATE TABLE "Followup" (
    "id" UUID NOT NULL,
    "structureId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "createdById" UUID,
    "medium" "FollowupMedium" NOT NULL,
    "date" DATE NOT NULL,
    "synthesis" TEXT,
    "status" "FollowupStatus" NOT NULL,
    "privateSynthesis" TEXT,
    "helpRequested" BOOLEAN,
    "place" TEXT,
    "redirected" BOOLEAN,
    "structureName" TEXT,
    "dueDate" DATE,
    "thirdPersonName" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" UUID NOT NULL,
    "structureId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "createdById" UUID,
    "openingDate" DATE NOT NULL,
    "typeId" UUID NOT NULL,
    "financialSupport" BOOLEAN NOT NULL,
    "externalStructure" BOOLEAN NOT NULL,
    "status" "HelpRequestStatus" NOT NULL,
    "askedAmount" DECIMAL(65,30),
    "examinationDate" DATE,
    "decisionDate" DATE,
    "allocatedAmount" DECIMAL(65,30),
    "paymentMethod" "PaymentMethod",
    "paymentDate" DATE,
    "handlingDate" DATE,
    "refusalReason" TEXT,
    "prescribingOrganisation" TEXT,
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
    "structureId" UUID NOT NULL,
    "createdById" UUID,
    "archivedById" UUID,
    "archived" TIMESTAMP(3),
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
    "region" TEXT,
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
    "pensionStructure" TEXT,
    "cafNumber" TEXT,
    "bank" TEXT,
    "funeralContract" TEXT,
    "protectionMeasure" "BeneficiaryProtectionMeasure",
    "representative" TEXT,
    "prescribingStructure" TEXT,
    "orientationType" "BeneficiaryOrientationType",
    "orientationStructure" TEXT,
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
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "byId" UUID,
    "name" TEXT NOT NULL,
    "targetUserId" UUID,
    "targetStructureId" UUID,
    "targetBeneficiaryId" UUID,
    "targetId" TEXT,
    "diff" JSONB NOT NULL,

    CONSTRAINT "MutationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentToFollowup" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentToHelpRequest" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FollowupToFollowupType" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_beneficiary_referents" (
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
CREATE UNIQUE INDEX "FollowupType_name_ownedByStructureId_key" ON "FollowupType"("name", "ownedByStructureId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_fileNumber_key" ON "Beneficiary"("fileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToFollowup_AB_unique" ON "_DocumentToFollowup"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToFollowup_B_index" ON "_DocumentToFollowup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToHelpRequest_AB_unique" ON "_DocumentToHelpRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToHelpRequest_B_index" ON "_DocumentToHelpRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FollowupToFollowupType_AB_unique" ON "_FollowupToFollowupType"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowupToFollowupType_B_index" ON "_FollowupToFollowupType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_beneficiary_referents_AB_unique" ON "_beneficiary_referents"("A", "B");

-- CreateIndex
CREATE INDEX "_beneficiary_referents_B_index" ON "_beneficiary_referents"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupType" ADD CONSTRAINT "FollowupType_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupType" ADD CONSTRAINT "FollowupType_ownedByStructureId_fkey" FOREIGN KEY ("ownedByStructureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedFollowupType" ADD CONSTRAINT "ProposedFollowupType_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedFollowupType" ADD CONSTRAINT "ProposedFollowupType_followupTypeId_fkey" FOREIGN KEY ("followupTypeId") REFERENCES "FollowupType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FollowupType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeneficiaryRelative" ADD CONSTRAINT "BeneficiaryRelative_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_byId_fkey" FOREIGN KEY ("byId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetStructureId_fkey" FOREIGN KEY ("targetStructureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetBeneficiaryId_fkey" FOREIGN KEY ("targetBeneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToFollowup" ADD CONSTRAINT "_DocumentToFollowup_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToFollowup" ADD CONSTRAINT "_DocumentToFollowup_B_fkey" FOREIGN KEY ("B") REFERENCES "Followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToHelpRequest" ADD CONSTRAINT "_DocumentToHelpRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToHelpRequest" ADD CONSTRAINT "_DocumentToHelpRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "HelpRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupToFollowupType" ADD CONSTRAINT "_FollowupToFollowupType_A_fkey" FOREIGN KEY ("A") REFERENCES "Followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupToFollowupType" ADD CONSTRAINT "_FollowupToFollowupType_B_fkey" FOREIGN KEY ("B") REFERENCES "FollowupType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
