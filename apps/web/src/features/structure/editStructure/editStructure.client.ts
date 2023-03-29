import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { editStructureSchema } from '@mss/web/server/schema'

export const EditStructureClient = createMutationClient({
  name: 'structure.edit',
  title: 'Modification de structure',
  inputValidation: editStructureSchema,
  securityCheck: canEditStructure,
  fieldLabels: {
    structureId: 'Identifiant de la structure',
    ...CreateStructureClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditStructureClient = typeof EditStructureClient
