import { prismaClient } from '@mss/web/prismaClient'
import { createMutationServer } from '@mss/web/features/createMutation.server'
import { CreateFollowupTypeClient } from '@mss/web/features/structure/createFollowupType/createFollowupType.client'
import { v4 } from 'uuid'

export const CreateFollowupTypeServer = createMutationServer({
  client: CreateFollowupTypeClient,
  executeMutation: async ({ input, user }) => {
    const { structureId, name } = input
    const id = v4()

    const followupType = await prismaClient.followupType.create({
      data: {
        id,
        legallyRequired: false,
        ownedByStructureId: structureId,
        name,
        createdById: user.id,
      },
    })

    return { followupType }
  },

  mutationLogInfo: ({
    input: { structureId },
    result: {
      followupType: { id },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CreateFollowupTypeServer = typeof CreateFollowupTypeServer
