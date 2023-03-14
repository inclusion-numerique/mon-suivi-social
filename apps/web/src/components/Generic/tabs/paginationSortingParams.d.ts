import { Sorting } from '../table'
import { SortDirection } from '../table/TableColumnDefinition'

// FIXME: Move to pagination.ts and sorting.ts once these two files are merged
export type PaginationSortingParams<
  T extends {
    pageNumber?: number
    currentSorting?: Sorting
    defaultSorting?: Sorting
  },
  G extends 'defaultSorting' | 'currentSorting' | 'pageNumber',
> = { page?: string; tri?: string; ordre?: SortDirection } & Omit<T, G>
