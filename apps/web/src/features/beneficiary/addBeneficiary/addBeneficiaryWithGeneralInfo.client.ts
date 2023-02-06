import { canCreateBeneficiaryWithGeneralInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  BeneficiaryStatus,
  BeneficiaryTitle,
  BeneficiaryGir,
  BeneficiaryMobility,
  BeneficiaryFamilySituation,
  Gender,
  BeneficiaryAccomodationMode,
  BeneficiarySocioProfessionalCategory,
  IncomeSource,
  BeneficiaryProtectionMeasure,
  BeneficiaryOrientationType,
} from '@prisma/client'

export const AddBeneficiaryWithGeneralInfoClient = createMutationClient({
  name: 'beneficiary.addWithGeneralInfo',
  securityCheck: canCreateBeneficiaryWithGeneralInfo,
  inputValidation: z.object({
    // General information
    structureId: z.string().uuid(),
    status: z.nativeEnum(BeneficiaryStatus),
    title: z.nativeEnum(BeneficiaryTitle).optional(),
    firstName: z.string().optional(),
    birthName: z.string().optional(),
    birthPlace: z.string().optional(),
    deathDate: z.date().optional(),
    gender: z.nativeEnum(Gender).optional(),
    nationality: z.string().optional(),
    accomodationMode: z.nativeEnum(BeneficiaryAccomodationMode).optional(),
    accomodationName: z.string().optional(),
    accomodationAdditionalInformation: z.string().optional(),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    zipcode: z.string().optional(),
    city: z.string().optional(),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    email: z.string().email().optional(),
    familySituation: z.nativeEnum(BeneficiaryFamilySituation).optional(),
    caregiver: z.boolean().optional(),
    minorChildren: z.number().int().gte(0).optional(),
    majorChildren: z.number().int().gte(0).optional(),
    mobility: z.nativeEnum(BeneficiaryMobility).optional(),
    administration: z.string().optional(),
    minister: z.string().optional(),

    // TODO This is for other full info form
    // Health
    gir: z.nativeEnum(BeneficiaryGir).optional(),
    doctor: z.string().optional(),
    healthAdditionalInformation: z.string().optional(),
    socialSecurityNumber: z.string().optional(),
    insurance: z.string().optional(),

    // Occupation
    socioProfessionalCategory: z
      .nativeEnum(BeneficiarySocioProfessionalCategory)
      .optional(),
    occupation: z.string().optional(),
    employer: z.string().optional(),
    employerSiret: z.string().optional(),
    mainIncomeSource: z.array(z.nativeEnum(IncomeSource)).optional(),
    mainIncomeAmount: z.number().optional(),
    partnerMainIncomeSource: z.array(z.nativeEnum(IncomeSource)).optional(),
    partnerMainIncomeAmount: z.number().optional(),
    majorChildrenMainIncomeSource: z
      .array(z.nativeEnum(IncomeSource))
      .optional(),
    majorChildrenMainIncomeAmount: z.number().optional(),
    unemploymentNumber: z.string().optional(),
    pensionStructure: z.string().optional(),
    cafNumber: z.string().optional(),
    bank: z.string().optional(),
    funeralContract: z.string().optional(),

    // External Structures
    protectionMeasure: z.nativeEnum(BeneficiaryProtectionMeasure).optional(),
    representative: z.string().optional(),
    prescribingStructure: z.string().optional(),
    orientationType: z.nativeEnum(BeneficiaryOrientationType).optional(),
    orientationStructure: z.string().optional(),
    serviceProviders: z.string().optional(),
    involvedPartners: z.string().optional(),

    // Additional info
    additionalInformation: z.string().optional(),
  }),
  // TODO anonymize all identification fields from above
  beneficiaryAnonymization: ({ firstName, structureId }) => ({
    structureId,
    firstName: '',
  }),
})
