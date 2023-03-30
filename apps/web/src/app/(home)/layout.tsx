import { PublicLayout } from '@mss/web/components/PublicLayout/PublicLayout'
import { PropsWithChildren } from 'react'
import styles from './page.module.scss'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PublicLayout className={styles.landingLayout}>{children}</PublicLayout>
  )
}
