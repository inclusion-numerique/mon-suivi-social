import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/components/PageLoading/PageLoading'

function StatsLoading() {
  return <PageLoading page={Routes.Statistiques.Index} />
}

export default StatsLoading
