import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

const StatsLoading = () => (
  <PageLoading page={Routes.Structure.Statistiques.Index} />
)

export default StatsLoading
