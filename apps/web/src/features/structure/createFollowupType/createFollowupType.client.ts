import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'

export const CreateFollowupTypeClient = createMutationClient({
  name: 'structure.createFollowupType',
  title: "Création de type d'accompagnement",
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateFollowupTypeClient = typeof CreateFollowupTypeClient
