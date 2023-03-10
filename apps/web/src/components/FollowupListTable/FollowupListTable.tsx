import { Routes } from '@mss/web/app/routing/routes'
import { FollowupsListResult } from '@mss/web/query'
import { getTotalPages } from '@mss/web/utils/table'
import {
  createPageLinkHelper,
  createSortLinkHelper,
  Sorting,
  Table,
  TableHeadWithSorting,
} from '../Generic'
import { followupListTableColumns } from './followupListTableColumns'
import { FollowupListTableRows } from './FollowupListTableRows'

export const FollowupListTable = ({
  followupsListResult,
  sorting,
  perPage,
  pageNumber,
  search,
}: {
  followupsListResult: FollowupsListResult
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
    count: followupsListResult.count,
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
