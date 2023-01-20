import PrivateLoading from '@mss/web/app/structure/loading'
import { PageTitle } from '@mss/web/app/structure/PageTitle'

// TODO Factorize main page and loading skeletons somehow
// TODO Put this in storybook along with main page
const StatsLoading = async () => {
  return (
    <>
      <PageTitle icon="pie-chart-2-line" title="Statistiques" />
      <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
        <PrivateLoading />
      </div>
    </>
  )
}

export default StatsLoading
