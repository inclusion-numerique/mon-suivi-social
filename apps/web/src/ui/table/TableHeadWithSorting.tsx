import { nonBreakable } from '@mss/web/utils/nonBreakable'
import Link from 'next/link'
import {
  Sorting,
  TableColumnDefinition,
} from '@mss/web/ui/table/TableColumnDefinition'

type TableHeadWithSortingProperties<Item, SortBy> = {
  columns: TableColumnDefinition<Item>[]
  createSortLink: (sorting: Sorting) => string
  currentSorting: Sorting<SortBy>
}

// Table header row with non breakable titles and accessible sort buttons
export function TableHeadWithSorting<Item, SortBy>({
  columns,
  createSortLink,
  currentSorting,
}: TableHeadWithSortingProperties<Item, SortBy>) {
  return (
    <tr>
      {columns.map((column) => (
        <th key={column.label}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {nonBreakable(column.label)}
            <SortLink
              column={column}
              currentSorting={currentSorting}
              createSortLink={createSortLink}
            />
          </div>
        </th>
      ))}
    </tr>
  )
}

type TableHeadSortLinkProperties<Item, SortBy> = {
  column: TableColumnDefinition<Item>
  createSortLink: (sorting: Sorting) => string
  currentSorting: Sorting<SortBy>
}

function SortLink<Item, SortBy>({
  column: { sortable, label },
  currentSorting: { by, direction },
  createSortLink,
}: TableHeadSortLinkProperties<Item, SortBy>) {
  if (!sortable) {
    return null
  }

  const isCurrent = by === label
  const isDesc = direction === 'desc'
  const isAsc = !isDesc

  const icon =
    isCurrent && isDesc ? 'fr-icon-arrow-up-line' : 'fr-icon-arrow-down-line'

  const title = `Trier par ${label.toLowerCase()}, ordre ${
    isCurrent && isAsc ? 'décroissant' : 'croissant'
  }`

  const href = createSortLink({
    by: label,
    direction: isCurrent && isAsc ? 'desc' : 'asc',
  })

  return (
    <Link
      className={`fr-btn fr-ml-2v fr-btn--tertiary-no-outline fr-btn--sm ${icon}`}
      title={title}
      href={href}
      style={{
        color: by === label ? undefined : 'var(--text-disabled-grey)',
      }}
    />
  )
}
