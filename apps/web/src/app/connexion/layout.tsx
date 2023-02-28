import { PropsWithChildren } from 'react'
import PublicHeader from '@mss/web/app/(public)/PublicHeader'
import PublicFooter from '@mss/web/app/(public)/PublicFooter'

function ConnexionLayout({ children }: PropsWithChildren) {
  return <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
    <PublicHeader hideSigninButton />
    <div style={{ flex: 1 }}>
      <div className="fr-container">{children}</div>{' '}
    </div>
    <PublicFooter />
  </div>
}

export default ConnexionLayout
