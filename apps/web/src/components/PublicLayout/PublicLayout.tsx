import { PropsWithChildren } from 'react'
import { PublicHeader } from '@mss/web/components/PublicHeader'
import { PublicFooter } from '@mss/web/components/PublicFooter'
import styles from './PublicLayout.module.css'

export function PublicLayout({
  hideSigninButton,
  className,
  children,
}: PropsWithChildren<{ hideSigninButton?: boolean; className?: string }>) {
  return (
    <div className={`${styles.layoutContainer} ${className}`}>
      <PublicHeader hideSigninButton={hideSigninButton} />
      {children}
      <PublicFooter />
    </div>
  )
}
