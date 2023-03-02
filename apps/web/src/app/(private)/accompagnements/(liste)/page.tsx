import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canAccessFollowupsPage } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { createPageLinkHelper } from '@mss/web/ui/pagination'
import { createSortLinkHelper } from '@mss/web/ui/sorting'
import { ListFollowupsServer } from '@mss/web/features/followup/listFollowups/listFollowups.server'
import { ListHelpRequestsServer } from '@mss/web/features/followup/listHelpRequests/listHelpRequests.server'
import { Table } from '@mss/web/ui/table/Table'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'
import {
  FollowupListTableRows,
  FollowupListTableColumns,
} from '@mss/web/components/FollowupListTable'
import {
  HelpRequestListTableRows,
  helpRequestListTableColumns,
} from '@mss/web/components/HelpRequestListTable'
import { TabOptions, Tabs } from '@mss/web/ui/tabs/Tabs'

const itemsPerPage = 15

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
    return null
  }
  const { structureId } = user

  const tab = searchParams?.tab ?? 'entretiens'

  const defaultSorting: Sorting =
    tab === 'entretiens'
      ? {
          by: 'date',
          direction: 'desc',
        }
      : { by: 'openingDate', direction: 'desc' }

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const [followupsList, helpRequestsList] = await Promise.all([
    ListFollowupsServer.execute({
      user,
      input:
        tab === 'entretiens'
          ? {
              structureId,
              perPage: itemsPerPage,
              page: pageNumber,
              orderBy: getColumnOrderBy(
                currentSorting,
                FollowupListTableColumns,
              ),
              search,
            }
          : { structureId, page: 1, perPage: itemsPerPage },
      securityParams: {},
    }),
    ListHelpRequestsServer.execute({
      user,
      input:
        tab === 'demandes-d-aide'
          ? {
              structureId,
              perPage: itemsPerPage,
              page: pageNumber,
              orderBy: getColumnOrderBy(
                currentSorting,
                helpRequestListTableColumns,
              ),
              search,
            }
          : { structureId, page: 1, perPage: itemsPerPage },
      securityParams: {},
    }),
  ])

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    {
      currentSorting,
      defaultSorting,
      search,
      tab: searchParams?.tab,
    },
    Routes.Accompagnements.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  const totalPages =
    tab === 'entretiens'
      ? followupsList.totalPages
      : helpRequestsList.totalPages
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    {
      pageNumber,
      defaultSorting,
      search,

      tab: searchParams?.tab,
    },
    Routes.Accompagnements.Index.pathWithParams,
  )

  const tabs = [
    {
      id: 'entretiens',
      title: 'Entretiens',
      href: Routes.Accompagnements.Index.pathWithParams(
        tab === 'entretiens' ? searchParams : {},
      ),
      content: (
        <Table
          tableHead={
            <TableHeadWithSorting
              columns={FollowupListTableColumns}
              createSortLink={createSortLink}
              currentSorting={currentSorting}
            />
          }
          tableBody={
            <FollowupListTableRows followups={followupsList.followups} />
          }
          pagination={{
            pageNumber,
            totalPages,
            createPageLink,
          }}
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
        <Table
          tableHead={
            <TableHeadWithSorting
              columns={helpRequestListTableColumns}
              createSortLink={createSortLink}
              currentSorting={currentSorting}
            />
          }
          tableBody={
            <HelpRequestListTableRows
              helpRequests={helpRequestsList.helpRequests}
            />
          }
          pagination={{
            pageNumber,
            totalPages,
            createPageLink,
          }}
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
