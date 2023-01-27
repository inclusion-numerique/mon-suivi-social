import { prismaClient } from '@mss/web/prismaClient'

const getExistingState = async ({ structureId }: { structureId: string }) => {
  const [structure, followupTypes] = await Promise.all([
    prismaClient.structure.findUniqueOrThrow({
      where: { id: structureId },
      include: {
        proposedFollowupTypes: { select: { followupTypeId: true } },
      },
    }),
    prismaClient.followupType.findMany({
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
  getExistingState,
}

export namespace EditStructureFeatureServer {
  export type ExistingState = Awaited<ReturnType<typeof getExistingState>>
}
