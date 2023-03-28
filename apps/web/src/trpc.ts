import 'client-only'
import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@mss/web/server/routers'

// TODO Export mocked TRPC on storybook env variable ?
export const trpc = createTRPCReact<AppRouter>()
