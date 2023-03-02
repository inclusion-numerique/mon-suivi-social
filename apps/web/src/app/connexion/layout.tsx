import { PropsWithChildren } from 'react'
import { PublicHeader } from '@mss/web/components/PublicHeader'
import { PublicFooter } from '@mss/web/components/PublicFooter'

function ConnexionLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      <PublicHeader hideSigninButton />
      <div style={{ flex: 1 }}>
        <div className="fr-container">{children}</div>{' '}
      </div>
      <PublicFooter />
    </div>
  )
}

export default ConnexionLayout
