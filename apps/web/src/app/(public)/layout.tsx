import { PublicLayout } from '@mss/web/app/(public)/PublicLayout'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return <PublicLayout>{children}</PublicLayout>
}
