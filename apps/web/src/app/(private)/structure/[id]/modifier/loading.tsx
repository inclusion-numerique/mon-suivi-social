import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/(private)/PageLoading'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Structure.Modifier,
      breadcrumbsTitle: '',
      title: '',
    }}
  />
)

export default Loading
