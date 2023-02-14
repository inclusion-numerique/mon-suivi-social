import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'

export const FollowupsListTab = asyncComponent(
  async ({
    structureId,
    searchParams,
  }: {
    structureId: string
    searchParams?: RoutePathParams<
      typeof Routes.Accompagnements.Index.pathWithParams
    >
  }) => {
    return <h2>The Followup list tab content</h2>
  },
)
