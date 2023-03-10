import { Routes } from '@mss/web/app/routing/routes'
import { HelpRequestsListResult } from '@mss/web/query'
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

export const HelpRequestListTable = ({
  helpRequestsListResult,
  sorting,
  perPage,
  pageNumber,
  search,
}: {
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

  const createSortLink = createSortLinkHelper(
    {
      pageNumber,
      defaultSorting,
      search,
    },
    Routes.Accompagnements.Index.pathWithParams,
  )
  return (
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
