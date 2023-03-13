import { Routes } from '@mss/web/app/routing/routes'
import { HelpRequestsListResult } from '@mss/web/query'
import { canAccessProtectedDataInHelpRequest } from '@mss/web/security/rules'
import { getTotalPages } from '@mss/web/utils/table'
import {
  createPageLinkHelper,
  createSortLinkHelper,
  Sorting,
  Table,
  TableHeadWithSorting,
} from '../Generic'
import { helpRequestListTableColumns } from './helpRequestListTableColumns'
import { HelpRequestListTableRows } from './HelpRequestListTableRows'
import { SessionUser } from '@mss/web/auth/sessionUser'

export const HelpRequestListTable = ({
  user,
  helpRequestsListResult,
  sorting,
  perPage,
  pageNumber,
  search,
}: {
  user: SessionUser
  helpRequestsListResult: HelpRequestsListResult
  sorting: Sorting
  perPage: number
  pageNumber: number
  search: string | undefined
}) => {
  const defaultSorting: Sorting = {
    by: 'date',
    direction: 'desc',
  }

  const currentSorting: Sorting = {
    by: sorting?.by ?? defaultSorting.by,
    direction: sorting?.direction ?? defaultSorting.direction,
  }

  const totalPages = getTotalPages({
    perPage,
    count: helpRequestsListResult.count,
  })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    {
      currentSorting,
      defaultSorting,
      search,
    },
    Routes.Accompagnements.Index.pathWithParams,
  )

  const createSortLink = createSortLinkHelper<{
    pageNumber: number
    defaultSorting: Sorting
    tab: 'demandes-d-aide'
    search?: string
  }>(
    {
      pageNumber,
      defaultSorting,
      search,
      tab: 'demandes-d-aide',
    },
    Routes.Accompagnements.Index.pathWithParams,
  )

  const accessibleColumns = helpRequestListTableColumns.filter(
    ({ isProtected }) =>
      !isProtected || canAccessProtectedDataInHelpRequest(user),
  )

  return (
    <Table
      tableHead={
        <TableHeadWithSorting
          columns={accessibleColumns}
          createSortLink={createSortLink}
          currentSorting={currentSorting}
        />
      }
      tableBody={
        <HelpRequestListTableRows
          user={user}
          helpRequests={helpRequestsListResult.helpRequests}
        />
      }
      pagination={{
        pageNumber,
        totalPages,
        createPageLink,
      }}
    />
  )
}
