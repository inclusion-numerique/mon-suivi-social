import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import {
  BeneficiaryAccomodationMode,
  BeneficiaryFamilySituation,
  BeneficiaryMobility,
  BeneficiaryStatus,
  BeneficiaryTitle,
  Gender,
} from '@prisma/client'
import { Nationalities } from '@mss/web/constants/nationality'
import { errorMessages, zodEnumFromObjectKeys } from '@mss/web/utils/zod'
import {
  isAdministrator,
  isInSameStructureAs,
  SecurityRuleGrantee,
  SecurityTargetWithStructure,
} from '@mss/web/security/rules'

const canCreateBeneficiaryWithGeneralInfo = (
  grantee: SecurityRuleGrantee,
  target: SecurityTargetWithStructure,
): boolean =>
  isAdministrator(grantee) ||
  isInSameStructureAs(grantee, target, [
    'StructureManager',
    'SocialWorker',
    'Instructor',
    'ReceptionAgent',
    'Referent',
  ])

export const AddBeneficiaryWithGeneralInfoClient = createMutationClient({
  name: 'beneficiary.addWithGeneralInfo',
  title: 'Ajout de bénéficiaire',
  securityCheck: canCreateBeneficiaryWithGeneralInfo,
  inputValidation: z.object({
    // General information
    structureId: z.string().uuid(),
    referents: z
      .array(z.string().uuid(), {
        ...errorMessages,
        required_error: 'Veuillez renseigner au moins un agent référent',
      })
      .min(1, 'Veuillez renseigner au moins un agent référent'),
    aidantConnectAuthorized: z.boolean().default(false),
    status: z.nativeEnum(BeneficiaryStatus, errorMessages),
    title: z.nativeEnum(BeneficiaryTitle).nullish(),
    firstName: z.string().nullish(),
    usualName: z.string().nullish(),
    birthName: z.string().nullish(),
    birthDate: z.date(errorMessages).nullish(),
    birthPlace: z.string().nullish(),
    deathDate: z.date(errorMessages).nullish(),
    gender: z.nativeEnum(Gender).nullish(),
    // nationality: z.enum(zodEnumFromObjectKeys(Nationalities)).nullish(),
    nationality: z.enum(zodEnumFromObjectKeys(Nationalities)).nullish(),
    accomodationMode: z.nativeEnum(BeneficiaryAccomodationMode).nullish(),
    accomodationName: z.string().nullish(),
    accomodationAdditionalInformation: z.string().nullish(),
    street: z.string().nullish(),
    streetNumber: z.string().nullish(),
    addressComplement: z.string().nullish(),
    zipcode: z.string().nullish(),
    city: z.string().nullish(),
    region: z.string().nullish(),
    noPhone: z.boolean().default(false),
    phone1: z.string().nullish(),
    phone2: z.string().nullish(),
    email: z.string().email().nullish(),
    familySituation: z.nativeEnum(BeneficiaryFamilySituation).nullish(),
    caregiver: z.boolean().default(false),
    minorChildren: z.number().int().gte(0).nullish(),
    majorChildren: z.number().int().gte(0).nullish(),
    mobility: z.nativeEnum(BeneficiaryMobility).nullish(),
    administration: z.string().nullish(),
    minister: z.string().nullish(),

    // Additional info
    additionalInformation: z.string().nullish(),
  }),
  beneficiaryAnonymization: () => ({
    aidantConnectAuthorized: undefined,
    title: undefined,
    firstName: undefined,
    usualName: undefined,
    birthName: undefined,
    birthDate: undefined,
    birthPlace: undefined,
    deathDate: undefined,
    gender: undefined,
    nationality: undefined,
    accomodationMode: undefined,
    accomodationName: undefined,
    accomodationAdditionalInformation: undefined,
    street: undefined,
    streetNumber: undefined,
    addressComplement: undefined,
    zipcode: undefined,
    city: undefined,
    region: undefined,
    noPhone: undefined,
    phone1: undefined,
    phone2: undefined,
    email: undefined,
    familySituation: undefined,
    caregiver: undefined,
    minorChildren: undefined,
    majorChildren: undefined,
    mobility: undefined,
    administration: undefined,
    minister: undefined,
    additionalInformation: undefined,
  }),
  fieldLabels: {
    structureId: 'Structure',
    referents: 'Agent(s) référent(s)',
    aidantConnectAuthorized: 'Mandat Aidant Connect',
    status: 'Statut du dossier',
    title: 'Civilité',
    usualName: 'Nom usuel',
    birthName: 'Nom de naissance',
    firstName: 'Prénom(s)',
    birthDate: 'Date de naissance',
    birthPlace: 'Lieu de naissance',
    gender: 'Genre',
    nationality: 'Nationalité',
    accomodationMode: "Mode d'hébergement",
    accomodationAdditionalInformation: 'Précisions hébergement',
    city: 'Ville',
    zipcode: 'Code postal',
    region: 'Région',
    streetNumber: 'Numéro de rue',
    street: 'Nom de la rue',
    addressComplement: "Complément d'adresse",
    noPhone: "N'a pas de téléphone",
    phone1: 'Téléphone 1',
    phone2: 'Téléphone 2',
    email: 'Email',
    familySituation: 'Situation familiale',
    minorChildren: "Nombre d'enfant(s) mineur(s)",
    majorChildren: "Nombre d'enfant(s) majeur(s)",
    caregiver: 'Aidant familial',
    mobility: 'Données mobilité',
    additionalInformation: 'Informations complémentaires',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddBeneficiaryWithGeneralInfoClient =
  typeof AddBeneficiaryWithGeneralInfoClient
