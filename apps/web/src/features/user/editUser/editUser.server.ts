import { prismaClient } from '@mss/web/prismaClient'
import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { invalidError } from '@mss/web/trpc/trpcErrors'
import { UserRole, UserStatus } from '@prisma/client'

export const EditUserServer = createMutationServerWithInitialState({
  client: EditUserClient,
  getServerState: async ({ userId }: { userId: string }) =>
    prismaClient.user.findUniqueOrThrow({
      where: { id: userId },
    }),
  dataFromServerState: ({ id, firstName, lastName, email, role, status }) => ({
    userId: id,
    firstName,
    lastName,
    email,
    role,
    enabled: status === 'Active',
  }),
  executeMutation: async ({ input, transaction, initialInput }) => {
    const { userId, firstName, lastName, email, role, enabled, ...data } = input

    const name = `${firstName} ${lastName}`
    const lowercaseEmail = email.toLowerCase()
    const status: UserStatus = enabled ? 'Active' : 'Disabled'

    if (role === UserRole.Administrator) {
      // Cannot create an admin with this feature
      throw invalidError()
    }

    const user = await transaction.user.update({
      where: { id: userId },
      data: {
        role,
        firstName,
        lastName,
        name,
        email: lowercaseEmail,
        status,
        ...data,
        updated: new Date(),
      },
    })

    return { user }
  },

  mutationLogInfo: ({
    input: { userId },
    result: {
      user: { structureId },
    },
  }) => ({
    targetId: userId,
    targetUserId: userId,
    targetStructureId: structureId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditUserServer = typeof EditUserServer
