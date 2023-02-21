import { FollowupType } from '@prisma/client'

export const groupFollowupTypesByLegality = <
  T extends Pick<FollowupType, 'legallyRequired'>,
>(
  followupTypes: T[],
) =>
  followupTypes.reduce(
    (result, followupType) => {
      if (followupType.legallyRequired) {
        result.legalFollowupTypes.push(followupType)
        return result
      }

      result.optionalFollowupTypes.push(followupType)
      return result
    },
    {
      legalFollowupTypes: [] as T[],
      optionalFollowupTypes: [] as T[],
    },
  )
