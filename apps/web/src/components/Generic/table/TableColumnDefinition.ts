import { CSSProperties, ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'
export type Sorting<By = string> = { by: By; direction: SortDirection }

export type TableColumnDefinition<Item = unknown, OrderByCondition = object> = {
  // Label of the table column, displayed in table header and accessibility labels
  label: string
  // If the column is sortable, provide a function that returns the "orderBy" configuration for the prisma request
  sortable?: (direction: SortDirection) => OrderByCondition[]
  // Content of the "cell" for this column, for a given item.
  content: (item: Item) => ReactNode
  options?: {
    justify?: CSSProperties['justifyContent']
    containerClassName?: string
  }
}

export const getColumnOrderBy = <Item>(
  sorting: Sorting,
  columns: TableColumnDefinition<Item>[],
): object[] => {
  const column = columns.find(({ label }) => label === sorting.by)
  if (!column || !column.sortable) {
    return []
  }

  return column.sortable(sorting.direction)
}
