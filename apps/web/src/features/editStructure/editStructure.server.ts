import { prismaClient } from '@mss/web/prismaClient'

const getExistingState = async ({
  organisationId,
}: {
  organisationId: string
}) => {
  const [structure, followupTypes] = await Promise.all([
    prismaClient.organisation.findUniqueOrThrow({
      where: { id: organisationId },
      include: {
        proposedFollowupTypes: { select: { followupTypeId: true } },
      },
    }),
    prismaClient.followupType.findMany({
      select: {
        id: true,
        name: true,
        legallyRequired: true,
        // To know if they are in use by the organisation
        _count: {
          select: {
            followups: {
              where: { organisationId },
            },
            helpRequests: {
              where: { organisationId },
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
