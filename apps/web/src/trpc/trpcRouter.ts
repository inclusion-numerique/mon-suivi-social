import { structureRouter } from '@mss/web/trpc/routers/structureRouter'
import { beneficiaryRouter } from '@mss/web/trpc/routers/beneficiaryRouter'
import { userRouter } from '@mss/web/trpc/routers/userRouter'
import { followupRouter } from '@mss/web/trpc/routers/followupRouter'
import { helpRequestRouter } from '@mss/web/trpc/routers/helpRequestRouter'
import { router } from './trpc'

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  structure: structureRouter,
  user: userRouter,
  followup: followupRouter,
  helpRequest: helpRequestRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
