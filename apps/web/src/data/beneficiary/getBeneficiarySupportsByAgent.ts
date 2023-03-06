import { findById } from './findById'
import type { FindByIdType } from './findById'

const getBeneficiarySupportsByAgent = async ({
  beneficiaryId,
  agentId,
}: {
  beneficiaryId: string
  agentId: string
}) => {
  const result: FindByIdType = await findById(beneficiaryId)

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

export { getBeneficiarySupportsByAgent }
