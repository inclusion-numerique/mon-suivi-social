import { PropsWithChildren } from 'react'
import { trpc } from '@mss/web/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import { useTrpcClient } from '@mss/web/components/TrpcProvider/useTrpcClient'

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
