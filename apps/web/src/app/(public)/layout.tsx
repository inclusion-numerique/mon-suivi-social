import { PropsWithChildren } from 'react'
import PublicHeader from '@mss/web/app/(public)/PublicHeader'
import PublicFooter from '@mss/web/app/(public)/PublicFooter'

const PublicLayout = ({
  hideSigninButton,
  children,
}: PropsWithChildren<{ hideSigninButton?: boolean }>) => {
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

export default PublicLayout
