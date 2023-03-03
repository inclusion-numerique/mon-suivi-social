import { PageConfig, PageTitle } from '../PageTitle'
import { PrivateLoading } from '../PrivateLoading'
import { BreadCrumbParents } from '@mss/web/components/Generic'

// TODO Put this in storybook along with main page
export function PageLoading({
  page,
  parents,
}: {
  page: PageConfig
  parents?: BreadCrumbParents
}) {
  return (
    <>
      <PageTitle page={page} parents={parents} />
      <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
        <PrivateLoading />
      </div>
    </>
  )
}
