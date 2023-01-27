import { prismaClient } from '@mss/web/prismaClient'
import { SessionUser } from '@mss/web/auth/sessionUser'

export const getSessionUserFromSessionToken = async (
  sessionToken: string | null,
): Promise<SessionUser | null> => {
  if (!sessionToken) {
    return null
  }

  const res = await prismaClient.session.findFirst({
    where: {
      sessionToken,
      expires: { gt: new Date() },
    },
    include: {
      user: { include: { structure: { select: { id: true, name: true } } } },
    },
  })

  if (!res?.user) {
    return null
  }

  return res.user
}
