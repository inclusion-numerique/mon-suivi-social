import { Sorting } from '@mss/web/components/Generic/table/TableColumnDefinition'
import { PaginationSortingParams } from './tabs/paginationSortingParams'

// TODO clean this and factorize with pagination helper for default removal logic that helps cache hits
// TODO add generic default params stuff to fallback to undefined
export const createSortLinkHelper =
  <T extends { pageNumber?: number; defaultSorting?: Sorting }>(
    { pageNumber, defaultSorting, ...otherParameters }: T,
    parametersToLink: PaginationSortingParams<
      T,
      'defaultSorting' | 'pageNumber'
    >,
  ) =>
  (sorting: Sorting) =>
    parametersToLink({
      page: pageNumber === 1 ? undefined : pageNumber?.toString(),
      tri: sorting.by === defaultSorting?.by ? undefined : sorting.by,
      ordre:
        sorting.direction === defaultSorting?.direction
          ? undefined
          : sorting.direction,
      ...otherParameters,
    })
