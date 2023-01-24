import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/structure/PageLoading'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Structure.Structures.Modifier,
      title: Routes.Structure.Structures.Modifier.title({
        name: '                   ',
      }),
    }}
  />
)

export default Loading
