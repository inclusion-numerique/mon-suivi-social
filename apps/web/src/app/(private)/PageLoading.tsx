import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import PrivateLoading from '@mss/web/app/(private)/PrivateLoading'
import { BreadCrumbParents } from '@mss/web/ui/Breadcrumbs'

// TODO Put this in storybook along with main page
export function PageLoading({
  page,
  parents,
}: {
  page: PageConfig
  parents?: BreadCrumbParents
}) {
  return <>
    <PageTitle page={page} parents={parents} />
    <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
      <PrivateLoading />
    </div>
  </>
}
