import { structureRouter } from '@mss/web/server/routers/structureRouter'
import { beneficiaryRouter } from '@mss/web/server/routers/beneficiaryRouter'
import { userRouter } from '@mss/web/server/routers/userRouter'
import { followupRouter } from '@mss/web/server/routers/followupRouter'
import { helpRequestRouter } from '@mss/web/server/routers/helpRequestRouter'
import { router } from '../createRouter'

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  structure: structureRouter,
  user: userRouter,
  followup: followupRouter,
  helpRequest: helpRequestRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
