import { BreadCrumbParents, Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import { Routes } from '@mss/web/app/routing/routes'

export const PageTitle = ({
  icon,
  title,
  breadcrumbsTitle,
  parents,
}: {
  icon: string
  title: string
  breadcrumbsTitle?: string
  parents?: BreadCrumbParents
}) => (
  <>
    <Breadcrumbs
      hideRoot
      className="fr-mb-4v"
      currentPage={breadcrumbsTitle ?? title}
      parents={[
        { title: 'Votre structure', href: Routes.Structure.Index },
        ...(parents ?? []),
      ]}
    />
    <h2>
      <span className={`fr-icon-${icon} fr-icon--lg fr-mr-1w`} />
      {title}
    </h2>
  </>
)
