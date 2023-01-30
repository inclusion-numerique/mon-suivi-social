import { prismaClient } from '@mss/web/prismaClient'

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

export const EditStructureFeatureServer = {
  getServerState,
}

export namespace EditStructureFeatureServer {
  export type ServerState = Awaited<ReturnType<typeof getServerState>>
}
