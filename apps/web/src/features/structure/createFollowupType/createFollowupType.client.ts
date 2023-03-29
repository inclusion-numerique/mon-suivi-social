import { canEditStructure } from '@mss/web/security/rules'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { createFollowupTypeSchema } from '@mss/web/server/schema'

export const CreateFollowupTypeClient = createMutationClient({
  name: 'structure.createFollowupType',
  title: "Création de type d'accompagnement",
  inputValidation: createFollowupTypeSchema,
  securityCheck: canEditStructure,
  fieldLabels: {
    structureId: 'Identifiant de la structure',
    name: 'Nom',
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateFollowupTypeClient = typeof CreateFollowupTypeClient
