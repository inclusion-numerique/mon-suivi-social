import 'client-only'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  CreateTRPCClientOptions,
  httpBatchLink,
  loggerLink,
} from '@trpc/client'
import { getUrl } from '@mss/web/utils/baseUrl'
import { trpc } from '@mss/web/trpc'
import { type AppRouter } from '@mss/web/trpc/trpcRouter'
import { transformer } from '@mss/web/utils/serialization'
import { create } from 'zustand'
import { PropsWithChildren } from 'react'

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

export function TrpcProvider({ children }: PropsWithChildren) {
  // We use zustand to share state across all components that may use trpc
  // AND lazily create clients only if needed
  // Even if there is multiple TrpcProvider components in the application at the same time
  const { trpcClient, queryClient } = useTrpcClient()

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

// HOC for using trpc in a subtree of client components
export const withTrpc =
  <P, C>(component: (properties: P) => C): ((properties: P) => C) =>
  (properties) => {
    const Component = component as any

    return (
      <TrpcProvider>
        <Component {...properties} />
      </TrpcProvider>
    ) as C
  }
