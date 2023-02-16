import { isAdministrator } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { StructureType } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'
import { errorMessages } from '@mss/web/utils/zod'

export const CreateStructureClient = createMutationClient({
  name: 'structure.create',
  title: 'Création de structure',
  securityCheck: (grantee) => isAdministrator(grantee),
  inputValidation: z.object({
    type: z.nativeEnum(StructureType),
    name: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
    zipcode: z.string(errorMessages).min(5, errorMessages.invalid_type_error),
    city: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
    address: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
    phone: z.string(errorMessages).min(10, errorMessages.invalid_type_error),
    email: z.string(errorMessages).email(errorMessages.invalid_type_error),
    // Ids of the followupTypes to propose
    proposedFollowupTypes: z.array(z.string().uuid()),
  }),
  fieldLabels: {
    type: 'Type',
    name: 'Raison sociale',
    address: 'Adresse',
    zipcode: 'Code postal',
    email: 'Email',
    phone: 'Téléphone',
    city: 'Ville',
    proposedFollowupTypes: 'Accompagnements proposés',
  },
})

export type CreateStructureClient = typeof CreateStructureClient

export const StructureTypeLabels: { [key in StructureType]: string } = {
  [StructureType.Ccas]: 'CCAS',
  [StructureType.Cias]: 'CIAS',
  [StructureType.Association]: 'Association',
  [StructureType.Commune]: 'Commune',
  [StructureType.Ministere]: 'Ministère',
}

export const structureTypeOptions = labelsToOptions(StructureTypeLabels)
