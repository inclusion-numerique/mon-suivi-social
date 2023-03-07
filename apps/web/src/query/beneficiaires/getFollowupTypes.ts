import { prismaClient } from '@mss/web/prismaClient'

const getFollowupTypes = ({ beneficiaryId }: { beneficiaryId: string }) =>
  prismaClient.followupType.findMany({
    where: {
      OR: [
        {
          followups: { some: { beneficiaryId } },
        },
        {
          helpRequests: { some: { beneficiaryId } },
        },
      ],
    },
  })

export { getFollowupTypes }
