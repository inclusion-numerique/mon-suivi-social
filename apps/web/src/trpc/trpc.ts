import { initTRPC, TRPCError } from '@trpc/server'
import { AppContext } from '@mss/web/trpc/trpcContext'
import { transformer } from '@mss/web/utils/serialization'

const t = initTRPC.context<AppContext>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated',
    })
  }
  return next({
    ctx: {
      // infers the user as non-nullable
      user: ctx.user,
    },
  })
})

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthenticated)
