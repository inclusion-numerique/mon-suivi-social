import { canEditUser } from '@mss/web/security/rules'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { CreateUserClient } from '@mss/web/features/user/createUser/createUser.client'
import z from 'zod'

export const EditUserClient = createMutationClient({
  name: 'user.edit',
  title: "Modification d'utilisateur",
  inputValidation: CreateUserClient.inputValidation
    .omit({ structureId: true })
    .extend({ userId: z.string().uuid(), enabled: z.boolean() }),
  securityCheck: canEditUser,
  fieldLabels: {
    userId: 'Utilisateur',
    enabled: 'Accès',
    ...CreateUserClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditUserClient = typeof EditUserClient
