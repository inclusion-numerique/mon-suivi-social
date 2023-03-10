import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/components/PageLoading'

function Loading() {
  return (
    <PageLoading
      page={{ ...Routes.Accompagnements.DemandeDAide.Modifier, title: '' }}
      parents={[Routes.Accompagnements.Index]}
    />
  )
}

export default Loading
