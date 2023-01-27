import { Routes } from '@mss/web/app/routing/routes'
import { PageLoading } from '@mss/web/app/structure/PageLoading'
import { loadingStructure } from '@mss/web/app/structure/structures/[id]/loadingStructure'

const Loading = () => (
  <PageLoading
    page={{
      ...Routes.Structure.Structures.Structure.Modifier,
      title:
        Routes.Structure.Structures.Structure.Modifier.title(loadingStructure),
    }}
    parents={[Routes.Structure.Structures.Index]}
  />
)

export default Loading
