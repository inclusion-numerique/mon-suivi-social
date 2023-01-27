import 'server-only'
import { Options } from '@mss/web/utils/options'
import { prismaClient } from '@mss/web/prismaClient'

import { getUserDisplayName } from '@mss/web/utils/user'

export const getAgentOptions = ({
  organisationId,
}: {
  organisationId: string | null
}): Promise<Options> | Options =>
  organisationId
    ? prismaClient.user
        .findMany({
          where: { role: { not: 'Administrator' }, organisationId },
          orderBy: { lastName: 'asc' },
        })
        .then((agents) =>
          agents.map((user) => ({
            value: user.id,
            name: getUserDisplayName(user),
          })),
        )
    : []
