import { Routes } from '@mss/web/app/routing/routes'
import { HelpRequestsListItem, HelpRequestsListResult } from '@mss/web/query'
import { getTotalPages } from '@mss/web/utils/table'
import {
  createPageLinkHelper,
  createSortLinkHelper,
  Sorting,
  Table,
  TableHeadWithSorting,
  TableColumnDefinition,
} from '../Generic'
import { HelpRequestListTableRows } from './HelpRequestListTableRows'

export const HelpRequestListTable = ({
  columns,
  helpRequestsListResult,
  sorting,
  perPage,
  pageNumber,
  search,
}: {
  columns: TableColumnDefinition<HelpRequestsListItem>[]
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

  return (
    <Table
      tableHead={
        <TableHeadWithSorting
          columns={columns}
          createSortLink={createSortLink}
          currentSorting={currentSorting}
        />
      }
      tableBody={
        <HelpRequestListTableRows
          columns={columns}
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
