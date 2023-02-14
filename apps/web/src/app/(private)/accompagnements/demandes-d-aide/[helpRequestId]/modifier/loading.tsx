import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

const Loading = () => (
  <PageLoading
    page={{ ...Routes.Accompagnements.DemandeDAide.Modifier, title: '' }}
    parents={[Routes.Accompagnements.Index]}
  />
)

export default Loading
