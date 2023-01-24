import { PageConfig, PageTitle } from '@mss/web/app/structure/PageTitle'
import PrivateLoading from '@mss/web/app/structure/PrivateLoading'
import { BreadCrumbParents } from '@mss/web/ui/Breadcrumbs'

// TODO Put this in storybook along with main page
export const PageLoading = ({
  page,
  parents,
}: {
  page: PageConfig
  parents?: BreadCrumbParents
}) => (
  <>
    <PageTitle page={page} parents={parents} />
    <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
      <PrivateLoading />
    </div>
  </>
)
