import { createMutationServer } from '@mss/web/features/createMutation.server'
import { CreateUserClient } from '@mss/web/features/user/createUser/createUser.client'
import { v4 } from 'uuid'
import { invalidError } from '@mss/web/trpc/trpcErrors'
import { NonAdminUserRole } from '@mss/web/constants/user'

export const CreateUserServer = createMutationServer({
  client: CreateUserClient,

  executeMutation: async ({ input, transaction }) => {
    const { structureId, role, firstName, lastName, email, ...data } = input

    if (!NonAdminUserRole[role]) {
      // Cannot create an admin with this feature
      throw invalidError()
    }

    const name = `${firstName} ${lastName}`
    const lowercaseEmail = email.toLowerCase()

    const user = await transaction.user.create({
      data: {
        id: v4(),
        structureId,
        role,
        firstName,
        lastName,
        name,
        email: lowercaseEmail,
        ...data,
      },
    })

    return { user }
  },
  mutationLogInfo: ({
    result: {
      user: { id, structureId },
    },
  }) => ({
    targetStructureId: structureId,
    targetId: id,
    targetUserId: id,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateUserServer = typeof CreateUserServer
