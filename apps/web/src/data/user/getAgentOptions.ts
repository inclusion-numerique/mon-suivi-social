import 'server-only'
import { Options } from '@mss/web/utils/options'
import { prismaClient } from '@mss/web/prismaClient'

import { getUserDisplayName } from '@mss/web/utils/user'

export const getAgentOptions = ({
  structureId,
}: {
  structureId: string | null
}): Promise<Options> | Options =>
  structureId
    ? prismaClient.user
        .findMany({
          where: { role: { not: 'Administrator' }, structureId },
          orderBy: { lastName: 'asc' },
        })
        .then((agents) =>
          agents.map((user) => ({
            value: user.id,
            name: getUserDisplayName(user),
          })),
        )
    : []
