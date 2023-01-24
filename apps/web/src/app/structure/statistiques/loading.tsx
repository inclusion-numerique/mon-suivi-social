import PrivateLoading from '@mss/web/app/structure/PrivateLoading'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'

// TODO Factorize main page and loading skeletons somehow
// TODO Put this in storybook along with main page
const StatsLoading = () => {
  return (
    <>
      <PageTitle page={Routes.Structure.Statistiques.Index} />
      <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
        <PrivateLoading />
      </div>
    </>
  )
}

export default StatsLoading
