import { PublicLayout } from '@mss/web/components/PublicLayout/PublicLayout'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>
}
