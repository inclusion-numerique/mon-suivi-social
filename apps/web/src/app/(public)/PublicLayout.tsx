import { PropsWithChildren } from 'react'
import { PublicHeader } from '@mss/web/components/PublicHeader'
import { PublicFooter } from '@mss/web/components/PublicFooter'

export function PublicLayout({
  hideSigninButton,
  children,
}: PropsWithChildren<{ hideSigninButton?: boolean }>) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      <PublicHeader hideSigninButton={hideSigninButton} />
      <div style={{ flex: 1 }}>
        <div>{children}</div>
      </div>
      <PublicFooter />
    </div>
  )
}
