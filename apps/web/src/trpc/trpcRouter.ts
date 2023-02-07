import { router } from './trpc'
import { structureRouter } from '@mss/web/trpc/routers/structureRouter'
import { beneficiaryRouter } from '@mss/web/trpc/routers/beneficiaryRouter'
import { userRouter } from '@mss/web/trpc/routers/userRouter'

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  structure: structureRouter,
  user: userRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
