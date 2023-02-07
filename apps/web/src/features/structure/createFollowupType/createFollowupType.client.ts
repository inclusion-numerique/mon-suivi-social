import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'

export const CreateFollowupTypeClient = createMutationClient({
  name: 'structure.createFollowupType',
  inputValidation: z.object({
    name: z
      .string({
        invalid_type_error: "Veuillez renseigner le nom de l'accompagnement",
      })
      .trim()
      .min(2, 'Veuillez renseigner au minimum 2 caractères'),
    structureId: z.string().uuid(),
  }),
  securityCheck: canEditStructure,
  fieldLabels: {
    structureId: 'Identifiant de la structure',
    name: 'Nom',
  },
})

export type CreateFollowupTypeClient = typeof CreateFollowupTypeClient
