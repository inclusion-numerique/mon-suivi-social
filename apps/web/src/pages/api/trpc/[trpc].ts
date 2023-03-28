import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '@mss/web/server/routers'
import { createContext } from '@mss/web/server/createContext'

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
