import { prismaClient } from '@mss/web/server/prisma/prismaClient'

const get = async (structureId: string) =>
  prismaClient.structure.findUniqueOrThrow({
    where: { id: structureId },
    include: {
      proposedFollowupTypes: {
        select: {
          followupType: {
            select: { id: true, name: true, legallyRequired: true },
          },
        },
      },
    },
  })

export { get }
