import { BreadCrumbParents, Breadcrumbs } from '@mss/web/components/Generic'
import { Routes } from '@mss/web/app/routing/routes'
import styles from './PageTitle.module.css'
import { PropsWithChildren } from 'react'

export type PageConfig = {
  title: string
  icon?: string
  breadcrumbsTitle?: string
}

export function PageTitle({
  page: { icon, title, breadcrumbsTitle },
  parents = [],
  children,
}: PropsWithChildren<{
  page: PageConfig
  parents?: BreadCrumbParents
}>) {
  const breadcrumbsParents: BreadCrumbParents = [
    { title: 'Accueil', path: Routes.TableauDeBord.path },
    ...parents,
  ]

  return (
    <>
      <Breadcrumbs
        hideRoot
        className="fr-mb-4v"
        currentPage={breadcrumbsTitle ?? title}
        parents={breadcrumbsParents}
      />
      <div className={styles.pageTitleContainer}>
        <h2>
          {icon ? (
            <span className={`fr-icon-${icon} fr-icon--lg fr-mr-1w`} />
          ) : null}
          {title}
        </h2>
        {children}
      </div>
    </>
  )
}
