import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/components/PageLoading/PageLoading'

function Loading() {
  return (
    <PageLoading
      page={{
        ...Routes.Utilisateurs.Modifier,
        title: '',
      }}
    />
  )
}

export default Loading
