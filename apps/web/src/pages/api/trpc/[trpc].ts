import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '@mss/web/trpc/trpcRouter'
import { createContext } from '@mss/web/trpc/trpcContext'

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
