import { Prisma, prismaClient } from '@mss/web/server/prisma/prismaClient'

const getSupports = async ({
  beneficiaryId,
  agentId,
}: {
  beneficiaryId: string
  agentId: string
}) => {
  const result = await prismaClient.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: {
      id: true,
      followups: {
        include: {
          createdBy: true,
          types: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      helpRequests: {
        include: {
          createdBy: true,
          type: true,
          prescribingOrganization: true,
        },
        orderBy: {
          openingDate: 'desc',
        },
      },
    },
  })

  if (!result) {
    return []
  }

  // Remove private info
  const followups = result.followups.map((followup) => {
    if (followup.createdById !== agentId) {
      followup.privateSynthesis = null
    }

    return {
      ...followup,
      historyDate: followup.date,
      __type: 'followup' as const,
    }
  })
  const helpRequests = result.helpRequests.map((helpRequest) => {
    if (helpRequest.createdById !== agentId) {
      helpRequest.privateSynthesis = null
    }
    return {
      ...helpRequest,
      historyDate: helpRequest.openingDate,
      __type: 'helpRequest' as const,
    }
  })

  return [...followups, ...helpRequests].sort(
    (a, b) => b.historyDate.getTime() - a.historyDate.getTime(),
  )
}

export { getSupports }

export type GetSupportsReturn = Prisma.PromiseReturnType<typeof getSupports>
