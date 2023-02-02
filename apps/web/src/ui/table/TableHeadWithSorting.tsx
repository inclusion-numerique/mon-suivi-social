import { nonBreakable } from '@mss/web/utils/nonBreakable'
import Link from 'next/link'
import {
  SortDirection,
  Sorting,
  TableColumnDefinition,
} from '@mss/web/ui/table/TableColumnDefinition'

type TableHeadWithSortingProps<Item, SortBy> = {
  columns: TableColumnDefinition<Item>[]
  createSortLink: (label: string, direction: SortDirection) => string
  currentSorting: Sorting<SortBy>
}

// Table header row with non breakable titles and accessible sort buttons
export function TableHeadWithSorting<Item, SortBy>({
  columns,
  createSortLink,
  currentSorting,
}: TableHeadWithSortingProps<Item, SortBy>) {
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

type TableHeadSortLinkProps<Item, SortBy> = {
  column: TableColumnDefinition<Item>
  createSortLink: (label: string, direction: SortDirection) => string
  currentSorting: Sorting<SortBy>
}
function SortLink<Item, SortBy>({
  column: { sortable, label },
  currentSorting: { by, direction },
  createSortLink,
}: TableHeadSortLinkProps<Item, SortBy>) {
  if (!sortable) {
    return null
  }

  const isCurrent = by === label
  const isDesc = direction === 'desc'
  const isAsc = !isDesc

  const icon =
    isCurrent && isDesc ? 'fr-icon-arrow-down-line' : 'fr-icon-arrow-up-line'

  const title = `Trier par ${label.toLowerCase()}, ordre ${
    isCurrent && isAsc ? 'décroissant' : 'croissant'
  }`

  const href = createSortLink(label, isCurrent && isAsc ? 'desc' : 'asc')

  return (
    <Link
      className={`fr-btn fr-ml-2v fr-btn--tertiary-no-outline fr-btn--sm ${icon}`}
      title={title}
      href={href}
      style={{
        color: by !== label ? 'var(--text-disabled-grey)' : undefined,
      }}
    />
  )
}
