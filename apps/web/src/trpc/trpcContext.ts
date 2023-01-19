import { inferAsyncReturnType, TRPCError } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/src/adapters/next'
import { getSessionTokenFromCookies } from '@mss/web/auth/getSessionTokenFromCookies'
import { getSessionUserFromSessionToken } from '@mss/web/auth/getSessionUserFromSessionToken'

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const sessionToken = getSessionTokenFromCookies(req.cookies)

  if (!sessionToken) {
    return { req, res, user: null }
  }
  const user = await getSessionUserFromSessionToken(sessionToken)
  if (!user) {
    // Not Signed in
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Not authorized.',
    })
  }
  return { req, res, user }
}

export type AppContext = inferAsyncReturnType<typeof createContext>
