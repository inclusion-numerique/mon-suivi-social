import { prismaClient } from '@mss/web/prismaClient'
import { computeArrayDiff } from '@mss/web/utils/diff'
import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'

export const EditStructureServer = createMutationServerWithInitialState({
  client: EditStructureClient,
  getServerState: async ({ structureId }: { structureId: string }) => {
    const [structure, followupTypes] = await Promise.all([
      prismaClient.structure.findUniqueOrThrow({
        where: { id: structureId },
        include: {
          proposedFollowupTypes: { select: { followupTypeId: true } },
        },
      }),
      prismaClient.followupType.findMany({
        where: {
          OR: [
            { ownedByStructureId: null },
            { ownedByStructureId: structureId },
          ],
        },
        select: {
          id: true,
          name: true,
          legallyRequired: true,
          // To know if they are in use by the structure
          _count: {
            select: {
              followups: {
                where: { structureId },
              },
              helpRequests: {
                where: { structureId },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ])

    return { structure, followupTypes }
  },
  executeMutation: async ({
    input,
    transaction,
    initialInput,
    serverState,
    user,
  }) => {
    const followupsDiff = computeArrayDiff(
      initialInput.proposedFollowupTypes,
      input.proposedFollowupTypes,
    )

    const { structureId, proposedFollowupTypes, ...data } = input

    const structure = await transaction.structure.update({
      where: { id: structureId },
      data: {
        ...data,
        updated: new Date(),
        proposedFollowupTypes: {
          createMany: {
            data: followupsDiff.added.map((followupTypeId) => ({
              followupTypeId,
            })),
            skipDuplicates: true,
          },
          deleteMany: {
            structureId,
            followupTypeId: { in: followupsDiff.removed },
          },
        },
      },
    })

    if (followupsDiff.removed.length > 0) {
      // If this is a custom followup type owned by this structure, delete it
      await transaction.followupType.deleteMany({
        where: {
          ownedByStructureId: structureId,
          id: { in: followupsDiff.removed },
        },
      })
    }

    return { structure }
  },
  dataFromServerState: ({
    structure: {
      id,
      name,
      address,
      zipcode,
      city,
      phone,
      email,
      proposedFollowupTypes,
    },
  }) => ({
    structureId: id,
    name,
    address,
    zipcode,
    city,
    phone,
    email,
    proposedFollowupTypes: proposedFollowupTypes.map(
      ({ followupTypeId }) => followupTypeId,
    ),
  }),
  mutationLogInfo: ({ input: { structureId } }) => ({
    targetId: structureId,
    targetStructureId: structureId,
  }),
})

export type EditStructureServer = typeof EditStructureServer
