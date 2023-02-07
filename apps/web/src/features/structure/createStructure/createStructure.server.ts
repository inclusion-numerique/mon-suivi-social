import { prismaClient } from '@mss/web/prismaClient'
import { createMutationServer } from '@mss/web/features/createMutation.server'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { v4 } from 'uuid'

export const getFollowupTypesForStructureCreation = () =>
  prismaClient.followupType.findMany({
    where: {
      OR: [{ ownedByStructureId: null }],
    },
    select: {
      id: true,
      name: true,
      legallyRequired: true,
    },
    orderBy: { name: 'asc' },
  })

export type FollowupTypesForStructureCreation = Awaited<
  ReturnType<typeof getFollowupTypesForStructureCreation>
>

export const CreateStructureServer = createMutationServer({
  client: CreateStructureClient,

  executeMutation: async ({ input, transaction, user }) => {
    const { proposedFollowupTypes, ...data } = input
    const structure = await transaction.structure.create({
      data: {
        id: v4(),
        ...data,
        proposedFollowupTypes: {
          createMany: {
            data: proposedFollowupTypes.map((followupTypeId) => ({
              followupTypeId,
            })),
            skipDuplicates: true,
          },
        },
      },
    })

    return { structure }
  },
  mutationLogInfo: ({
    result: {
      structure: { id },
    },
  }) => ({
    targetId: id,
    targetStructureId: id,
  }),
})

export type CreateStructureServer = typeof CreateStructureServer
