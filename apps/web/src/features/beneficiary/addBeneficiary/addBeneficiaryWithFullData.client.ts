import { canCreateBeneficiaryWithFullData } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  BeneficiaryGir,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  IncomeSource,
} from '@prisma/client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'

export const AddBeneficiaryWithFullDataClient = createMutationClient({
  name: 'beneficiary.addWithFullData',
  securityCheck: canCreateBeneficiaryWithFullData,
  inputValidation: AddBeneficiaryWithGeneralInfoClient.inputValidation.extend({
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
  }),
  // TODO anonymize all identification fields from above
  beneficiaryAnonymization: (input) => {
    // TODO this is not undefined, fix typings to allow usage without checking
    const partiallyAnonymized =
      !!AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization
        ? AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization(input)
        : input

    return {
      ...partiallyAnonymized,
      doctor: '',
    }
  },
  fieldLabels: {
    ...AddBeneficiaryWithGeneralInfoClient.fieldLabels,
    // TODO Other field labels
  },
})
export type AddBeneficiaryWithFullDataClient =
  typeof AddBeneficiaryWithFullDataClient
