import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

function Loading() {
  return <PageLoading page={Routes.Utilisateurs.Ajouter} />
}

export default Loading
