import PrivateLoading from '@mss/web/app/structure/loading'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/app/structure/PageTitle'

// TODO Factorize main page and loading skeletons somehow
// TODO Put this in storybook along with main page
const StatsLoading = async () => {
  const { organisation } = await getAuthenticatedAgent()
  return (
    <>
      <PageTitle icon="pie-chart-2-line">
        Statistiques {organisation.name}
      </PageTitle>
      <div className="fr-grid-row fr-mt-2v fr-grid-row--center">
        <PrivateLoading />
      </div>
    </>
  )
}

export default StatsLoading
