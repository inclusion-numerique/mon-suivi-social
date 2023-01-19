import 'client-only'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  CreateTRPCClientOptions,
  httpBatchLink,
  loggerLink,
} from '@trpc/client'
import { getUrl } from '@mss/web/utils/baseUrl'
import { trpc } from '@mss/web/trpc'
import { FunctionComponentWithChildren } from '@mss/web/utils/componentHelpers'
import { withProvider } from '@mss/web/utils/withProvider'
import { type AppRouter } from '@mss/web/trpc/trpcRouter'
import { transformer } from '@mss/web/utils/serialization'

// TODO make a global singleton like prisma ? So same value is used in different provider wraps
export const TrpcProvider: FunctionComponentWithChildren = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())

  const clientOptions: CreateTRPCClientOptions<AppRouter> = {
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: `${getUrl('/api/trpc')}`,
      }),
    ],
    // FIXME transformers make storybook stories disapear :/
    transformer,
  }

  const [trpcClient] = useState(() => trpc.createClient(clientOptions))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

// HOC for using trpc in a subtree of client components
export const withTrpc = withProvider(TrpcProvider)
