import { prismaClient } from '@mss/web/prismaClient'

const getInclusionConnectAccount = async (userId: string, provider: string) =>
  prismaClient.account.findFirst({
    where: { userId, provider },
  })

export { getInclusionConnectAccount }
