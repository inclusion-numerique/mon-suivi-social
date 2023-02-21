import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'

export const EditStructureClient = createMutationClient({
  name: 'structure.edit',
  title: 'Modification de structure',
  inputValidation: CreateStructureClient.inputValidation
    .omit({ type: true })
    .extend({
      structureId: z.string().uuid(),
    }),
  securityCheck: canEditStructure,
  fieldLabels: {
    structureId: 'Identifiant de la structure',
    ...CreateStructureClient.fieldLabels,
  },
})

export type EditStructureClient = typeof EditStructureClient
