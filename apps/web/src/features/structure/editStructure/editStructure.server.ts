import { prismaClient } from '@mss/web/prismaClient'
import { Prisma } from '@prisma/client'
import { MutationFeature } from '@mss/web/features/feature'
import { EditStructureFeatureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { computeArrayDiff } from '@mss/web/utils/diff'
import { MutationDiff, MutationLogInfo } from '@mss/web/features/mutationLog'

const getServerState = async ({ structureId }: { structureId: string }) => {
  const [structure, followupTypes] = await Promise.all([
    prismaClient.structure.findUniqueOrThrow({
      where: { id: structureId },
      include: {
        proposedFollowupTypes: { select: { followupTypeId: true } },
      },
    }),
    prismaClient.followupType.findMany({
      where: {
        OR: [{ ownedByStructureId: null }, { ownedByStructureId: structureId }],
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
}

const mutationLogInfo = ({
  structureId,
}: EditStructureFeatureClient.Data): MutationLogInfo => ({
  name: 'structure.edit',
  targetId: structureId,
  targetStructureId: structureId,
})

const executeMutation = async ({
  serverState,
  initialData,
  mutationData,
  diff,
  transaction,
}: {
  serverState: EditStructureFeatureServer.ServerState
  initialData: EditStructureFeatureClient.Data
  mutationData: EditStructureFeatureClient.Data
  diff: MutationDiff
  transaction: Prisma.TransactionClient
}) => {
  const followupsDiff = computeArrayDiff(
    initialData.proposedFollowupTypes,
    mutationData.proposedFollowupTypes,
  )

  const { structureId, proposedFollowupTypes, ...data } = mutationData

  const structure = await transaction.structure.update({
    where: { id: structureId },
    data: {
      ...data,
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
}

export const EditStructureFeatureServer = {
  getServerState,
  mutationLogInfo,
  executeMutation,
}

export namespace EditStructureFeatureServer {
  export type ServerState = Awaited<ReturnType<typeof getServerState>>
  export type MutationResult = Awaited<ReturnType<typeof executeMutation>>
}

export const EditStructureFeature = {
  ...EditStructureFeatureClient,
  ...EditStructureFeatureServer,
} satisfies MutationFeature<
  EditStructureFeatureClient.Data,
  {},
  EditStructureFeatureServer.ServerState,
  EditStructureFeatureServer.MutationResult
>
