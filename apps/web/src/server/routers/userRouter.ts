import { protectedProcedure, router } from '@mss/web/server/createRouter'
import { CreateUserClient } from '@mss/web/features/user/createUser/createUser.client'
import { CreateUserServer } from '@mss/web/features/user/createUser/createUser.server'
import { EditUserClient } from '@mss/web/features/user/editUser/editUser.client'
import { EditUserServer } from '@mss/web/features/user/editUser/editUser.server'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { invalidError } from '@mss/web/server/trpcErrors'

export const userRouter = router({
  add: protectedProcedure
    .input(CreateUserClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      CreateUserServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
      }),
    ),
  edit: protectedProcedure
    .input(EditUserClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const userToEdit = await prismaClient.user.findUniqueOrThrow({
        where: { id: input.userId },
        select: { structureId: true },
      })

      if (!userToEdit.structureId) {
        // Cannot edit a user not attributed to a structure
        throw invalidError()
      }

      return EditUserServer.execute({
        input,
        user,
        target: userToEdit,
        securityParams: {},
        getServerStateInput: input,
        structureId: userToEdit.structureId,
      })
    }),
})
