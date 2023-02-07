import { isAdministrator } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { StructureType } from '@prisma/client'
import { labelsToOptions } from '@mss/web/utils/options'

export const CreateStructureClient = createMutationClient({
  name: 'structure.create',
  securityCheck: (grantee) => isAdministrator(grantee),
  inputValidation: z.object({
    type: z.nativeEnum(StructureType),
    name: z.string().min(2),
    zipcode: z.string().min(5),
    city: z.string().min(2),
    address: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
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
