import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/components/PageLoading/PageLoading'

function Loading() {
  return (
    <PageLoading
      page={{
        ...Routes.Accompagnements.Entretien.Nouveau,
        title: '',
      }}
      parents={[Routes.Accompagnements.Index]}
    />
  )
}

export default Loading
