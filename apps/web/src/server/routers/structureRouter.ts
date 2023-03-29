import { protectedProcedure, router } from '@mss/web/server/createRouter'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { CreateStructureServer } from '@mss/web/features/structure/createStructure/createStructure.server'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { CreateFollowupTypeClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { CreateFollowupTypeServer } from '@mss/web/features/structure/createFollowupType/createFollowupType.server'

export const structureRouter = router({
  add: protectedProcedure
    .input(CreateStructureClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      CreateStructureServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
      }),
    ),
  edit: protectedProcedure
    .input(EditStructureClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      EditStructureServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
        getServerStateInput: input,
        structureId: input.structureId,
      }),
    ),
  createFollowupType: protectedProcedure
    .input(CreateFollowupTypeClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      CreateFollowupTypeServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
        structureId: input.structureId,
      }),
    ),
})
