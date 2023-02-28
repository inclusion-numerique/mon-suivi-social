import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

function Loading() {
  return <PageLoading
    page={{
      ...Routes.Structure.Modifier,
      breadcrumbsTitle: '',
      title: '',
    }}
  />
}

export default Loading
