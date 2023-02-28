import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

function Loading() {
  return <PageLoading
    page={{ ...Routes.Accompagnements.Entretien.Modifier, title: '' }}
    parents={[Routes.Accompagnements.Index]}
  />
}

export default Loading
