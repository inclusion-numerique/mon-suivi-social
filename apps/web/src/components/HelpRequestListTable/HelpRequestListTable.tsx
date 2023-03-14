import { Routes } from '@mss/web/app/routing/routes'
import { HelpRequestsListItem, HelpRequestsListResult } from '@mss/web/query'
import { getTotalPages } from '@mss/web/utils/table'
import {
  Sorting,
  Table,
  TableHeadWithSorting,
  TableColumnDefinition,
  createTableLinks,
} from '../Generic'
import { HelpRequestListTableRows } from './HelpRequestListTableRows'

export const HelpRequestListTable = ({
  columns,
  helpRequestsListResult,
  currentSorting,
  defaultSorting,
  perPage,
  pageNumber,
  search,
}: {
  columns: TableColumnDefinition<HelpRequestsListItem>[]
  helpRequestsListResult: HelpRequestsListResult
  currentSorting: Sorting
  defaultSorting: Sorting
  perPage: number
  pageNumber: number
  search?: string
}) => {
  const totalPages = getTotalPages({
    perPage,
    count: helpRequestsListResult.count,
  })

  const { createPageLink, createSortLink } =
    createTableLinks<'demandes-d-aide'>(
      {
        pageNumber,
        currentSorting,
        defaultSorting,
        tab: 'demandes-d-aide',
        search,
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
