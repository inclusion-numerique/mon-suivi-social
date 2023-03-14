import {
  CreateTRPCClientOptions,
  httpBatchLink,
  loggerLink,
} from '@trpc/client'
import { AppRouter } from '@mss/web/trpc/trpcRouter'
import { getUrl } from '@mss/web/utils/baseUrl'
import { transformer } from '@mss/web/utils/serialization'
import { create } from 'zustand'
import { QueryClient } from '@tanstack/react-query'
import { trpc } from '@mss/web/trpc'

const clientOptions: CreateTRPCClientOptions<AppRouter> = {
  links: [
    loggerLink({
      enabled: (options) =>
        process.env.NODE_ENV === 'development' ||
        (options.direction === 'down' && options.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getUrl('/api/trpc')}`,
    }),
  ],
  // FIXME transformers make storybook stories disapear :/
  transformer,
}

export const useTrpcClient = create(() => ({
  queryClient: new QueryClient(),
  trpcClient: trpc.createClient(clientOptions),
}))
