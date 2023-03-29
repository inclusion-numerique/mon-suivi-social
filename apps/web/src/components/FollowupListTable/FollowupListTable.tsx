import { Routes } from '@mss/web/app/routing/routes'
import { FollowupsListResult } from '@mss/web/server/query'
import { getTotalPages } from '@mss/web/utils/table'
import {
  createTableLinks,
  Sorting,
  Table,
  TableHeadWithSorting,
} from '../Generic'
import { followupListTableColumns } from './followupListTableColumns'
import { FollowupListTableRows } from './FollowupListTableRows'

export const FollowupListTable = ({
  followupsListResult,
  currentSorting,
  defaultSorting,
  perPage,
  pageNumber,
  search,
}: {
  followupsListResult: FollowupsListResult
  currentSorting: Sorting
  defaultSorting: Sorting
  perPage: number
  pageNumber: number
  search?: string
}) => {
  const totalPages = getTotalPages({
    perPage,
    count: followupsListResult.count,
  })

  const { createPageLink, createSortLink } = createTableLinks(
    { pageNumber, currentSorting, defaultSorting, search },
    Routes.Accompagnements.Index.pathWithParams,
  )

  return (
    <Table
      tableHead={
        <TableHeadWithSorting
          columns={followupListTableColumns}
          createSortLink={createSortLink}
          currentSorting={currentSorting}
        />
      }
      tableBody={
        <FollowupListTableRows followups={followupsListResult.followups} />
      }
      pagination={{
        pageNumber,
        totalPages,
        createPageLink,
      }}
    />
  )
}
