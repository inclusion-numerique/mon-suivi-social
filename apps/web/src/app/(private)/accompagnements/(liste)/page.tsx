import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canAccessFollowupsPage } from '@mss/web/security/rules'
import { notFound } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
  parseTableSearchParams,
  TabOptions,
  Tabs,
} from '@mss/web/components/Generic'
import { FollowupListTable } from '@mss/web/components/FollowupListTable/FollowupListTable'
import { HelpRequestListTable } from '@mss/web/components/HelpRequestListTable/HelpRequestListTable'
import { AccompagnementsQuery } from '@mss/web/server/query'
import { followupListTableColumns } from '@mss/web/components/FollowupListTable'
import { buildHelpRequestListTableColumns } from '@mss/web/components/HelpRequestListTable'
import { DEFAULT_PER_PAGE } from '@mss/web/components/Generic/pagination'

const perPage = DEFAULT_PER_PAGE

const defaultSorting: Sorting = {
  by: 'date',
  direction: 'desc',
}

const AccompagnementsListPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Accompagnements.Index.pathWithParams
  >
}) => {
  const user = await getAuthenticatedAgent()
  if (!canAccessFollowupsPage(user, { structureId: user.structureId })) {
    notFound()
  }
  const tab = searchParams?.tab ?? 'entretiens'

  const { pageNumber, currentSorting, search } = parseTableSearchParams(
    searchParams,
    defaultSorting,
  )

  const helpRequestListTableColumns = buildHelpRequestListTableColumns(user)

  const [helpRequestsListResult, followupsListResult] = await Promise.all([
    AccompagnementsQuery.iterateHelpRequests({
      page: pageNumber,
      perPage,
      orderBy: getColumnOrderBy(currentSorting, helpRequestListTableColumns),
    }),
    AccompagnementsQuery.iterateFollowups({
      page: pageNumber,
      perPage,
      orderBy: getColumnOrderBy(currentSorting, followupListTableColumns),
    }),
  ])

  const tabs = [
    {
      id: 'entretiens',
      title: 'Entretiens',
      href: Routes.Accompagnements.Index.pathWithParams(
        tab === 'entretiens' ? searchParams : {},
      ),
      content: (
        <FollowupListTable
          currentSorting={currentSorting}
          defaultSorting={defaultSorting}
          perPage={perPage}
          pageNumber={pageNumber}
          search={search}
          followupsListResult={followupsListResult}
        />
      ),
    },
    {
      id: 'demandes-d-aide',
      title: "Demandes d'aide",
      href: Routes.Accompagnements.Index.pathWithParams(
        tab === 'demandes-d-aide' ? searchParams : { tab: 'demandes-d-aide' },
      ),
      content: (
        <HelpRequestListTable
          columns={helpRequestListTableColumns}
          currentSorting={currentSorting}
          defaultSorting={defaultSorting}
          perPage={perPage}
          pageNumber={pageNumber}
          search={search}
          helpRequestsListResult={helpRequestsListResult}
        />
      ),
    },
  ] satisfies TabOptions<typeof tab>[]

  return (
    <>
      <PageTitle page={Routes.Accompagnements.Index} />
      <Tabs ariaLabel="Liste des accompagnements" current={tab} tabs={tabs} />
    </>
  )
}
export default AccompagnementsListPage
