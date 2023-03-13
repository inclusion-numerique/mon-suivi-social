import { canCreateBeneficiaryWithFullData } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  BeneficiaryGir,
  BeneficiaryOrientationType,
  BeneficiaryProtectionMeasure,
  BeneficiarySocioProfessionalCategory,
  IncomeSource,
  RelativeRelationship,
} from '@prisma/client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { arrayToOptions, labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'
import { PensionOrganisations } from '@mss/web/constants/beneficiary'

export const AddBeneficiaryWithFullDataClient = createMutationClient({
  name: 'beneficiary.addWithFullData',
  title: 'Ajout de bénéficiaire',
  securityCheck: canCreateBeneficiaryWithFullData,
  inputValidation: AddBeneficiaryWithGeneralInfoClient.inputValidation.extend({
    // Health
    gir: z.nativeEnum(BeneficiaryGir).nullish(),
    doctor: z.string().nullish(),
    healthAdditionalInformation: z.string().nullish(),
    socialSecurityNumber: z.string().nullish(),
    insurance: z.string().nullish(),

    // Occupation
    socioProfessionalCategory: z
      .nativeEnum(BeneficiarySocioProfessionalCategory)
      .nullish(),
    occupation: z.string().nullish(),
    employer: z.string().nullish(),
    employerSiret: z.string().nullish(),
    mainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    mainIncomeAmount: z.number().nullish(),
    partnerMainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    partnerMainIncomeAmount: z.number().nullish(),
    majorChildrenMainIncomeSource: z
      .array(z.nativeEnum(IncomeSource, errorMessages))
      .optional(),
    majorChildrenMainIncomeAmount: z.number().nullish(),
    unemploymentNumber: z.string().nullish(),
    pensionOrganisations: z
      .array(z.enum(PensionOrganisations, errorMessages))
      .optional(),
    cafNumber: z.string().nullish(),
    bank: z.string().nullish(),
    funeralContract: z.string().nullish(),

    // External Structures
    protectionMeasure: z.nativeEnum(BeneficiaryProtectionMeasure).nullish(),
    representative: z.string().nullish(),
    prescribingStructure: z.string().nullish(),
    orientationType: z.nativeEnum(BeneficiaryOrientationType).nullish(),
    orientationStructure: z.string().nullish(),
    serviceProviders: z.string().nullish(),
    involvedPartners: z.string().nullish(),
  }),
  beneficiaryAnonymization: (input) => {
    // TODO this is not undefined, fix typings to allow usage without checking
    const partiallyAnonymized =
      AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization
        ? AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization(input)
        : input

    return {
      ...partiallyAnonymized,
      doctor: undefined,
      healthAdditionalInformation: undefined,
      socialSecurityNumber: undefined,
      insurance: undefined,
      occupation: undefined,
      employer: undefined,
      employerSiret: undefined,
      mainIncomeSource: undefined,
      mainIncomeAmount: undefined,
      partnerMainIncomeSource: undefined,
      partnerMainIncomeAmount: undefined,
      majorChildrenMainIncomeSource: undefined,
      majorChildrenMainIncomeAmount: undefined,
      unemploymentNumber: undefined,
      pensionOrganisations: undefined,
      cafNumber: undefined,
      bank: undefined,
      funeralContract: undefined,
      protectionMeasure: undefined,
      representative: undefined,
      prescribingStructure: undefined,
      orientationType: undefined,
      orientationStructure: undefined,
      serviceProviders: undefined,
      involvedPartners: undefined,
    }
  },
  fieldLabels: {
    ...AddBeneficiaryWithGeneralInfoClient.fieldLabels,
    gir: 'GIR',
    doctor: 'Médecin traitant',
    healthAdditionalInformation: 'Autres informations de santé',
    socialSecurityNumber: 'N° Sécurité Sociale',
    insurance: 'Mutuelle',
    socioProfessionalCategory: 'Catégorie socio-professionnelle',
    occupation: 'Profession(s)',
    employer: 'Employeur',
    employerSiret: "SIRET de l'employeur",
    mainIncomeSource: 'Natures des ressources',
    mainIncomeAmount: 'Montant des ressources',
    unemploymentNumber: 'N° Pôle Emploi',
    pensionOrganisations: 'Organismes de retraite',
    cafNumber: 'N° CAF',
    bank: 'Banque',
    funeralContract: 'Contrat obsèques',
    protectionMeasure: 'Mesures de protection',
    representative: 'Nom, prénom, coordonées du mandataire',
    prescribingStructure: 'Organisme prescripteur',
    orientationType: "Mode d'orientation",
    orientationStructure: "Organisme d'orientation",
    serviceProviders: 'Prestataires',
    involvedPartners: 'Partenaires intervenants',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddBeneficiaryWithFullDataClient =
  typeof AddBeneficiaryWithFullDataClient

export const relativeRelationshipLabels: {
  [key in RelativeRelationship]: string
} = {
  [RelativeRelationship.Conjoint]: 'Conjoint·e',
  [RelativeRelationship.EnfantMajeur]: 'Enfant majeur',
  [RelativeRelationship.EnfantMineur]: 'Enfant mineur',
  [RelativeRelationship.Sibling]: 'Fratrie',
  [RelativeRelationship.Grandparent]: 'Grand-parent',
  [RelativeRelationship.Parent]: 'Parent',
  [RelativeRelationship.Tiers]: 'Tiers',
  [RelativeRelationship.Neighbour]: 'Voisin·e',
  [RelativeRelationship.AutreMemberDeLaFamille]: 'Autre membre de la famille',
}

export const relativeRelationshipOptions = labelsToOptions(
  relativeRelationshipLabels,
)
