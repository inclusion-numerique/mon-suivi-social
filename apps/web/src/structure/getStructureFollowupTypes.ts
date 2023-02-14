import { prismaClient } from '@mss/web/prismaClient'

export const getStructureFollowupTypes = ({
  structureId,
}: {
  structureId: string
}) =>
  prismaClient.proposedFollowupType.findMany({
    where: {
      structureId,
    },
    include: {
      followupType: true,
    },
    orderBy: [{ followupType: { name: 'asc' } }],
  })
