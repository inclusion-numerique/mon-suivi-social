import { prismaClient } from '@mss/web/server/prisma/prismaClient'

const getStructureFollowupTypes = ({ structureId }: { structureId: string }) =>
  prismaClient.proposedFollowupType.findMany({
    where: {
      structureId,
    },
    include: {
      followupType: true,
    },
    orderBy: [{ followupType: { name: 'asc' } }],
  })

export { getStructureFollowupTypes }
