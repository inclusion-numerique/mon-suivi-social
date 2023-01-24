import { BreadCrumbParents, Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import { Routes } from '@mss/web/app/routing/routes'

export const PageTitle = ({
  icon,
  title,
  breadcrumbsTitle,
  parents = [],
  organisationName,
}: {
  icon: string
  title: string
  breadcrumbsTitle?: string
  parents?: BreadCrumbParents
  organisationName?: string
}) => {
  const breadcrumbsParents = organisationName
    ? [
        {
          title: organisationName,
          href: Routes.Structure.Index,
        },
        ...parents,
      ]
    : parents

  return (
    <>
      <Breadcrumbs
        hideRoot
        className="fr-mb-4v"
        currentPage={breadcrumbsTitle ?? title}
        parents={breadcrumbsParents}
      />
      <h2>
        <span className={`fr-icon-${icon} fr-icon--lg fr-mr-1w`} />
        {title}
      </h2>
    </>
  )
}
