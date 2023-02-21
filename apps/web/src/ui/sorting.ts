import { SortDirection, Sorting } from '@mss/web/ui/table/TableColumnDefinition'

// TODO clean this and factorize with pagination helper for default removal logic that helps cache hits
// TODO add generic default params stuff to fallback to undefined
export const createSortLinkHelper =
  <T extends { pageNumber?: number; defaultSorting?: Sorting }>(
    { pageNumber, defaultSorting, ...otherParams }: T,
    paramsToLink: (
      params: { page?: string; tri?: string; ordre?: SortDirection } & Omit<
        T,
        'defaultSorting' | 'pageNumber'
      >,
    ) => string,
  ) =>
  (sorting: Sorting) =>
    paramsToLink({
      page: pageNumber === 1 ? undefined : pageNumber?.toString(),
      tri: sorting.by === defaultSorting?.by ? undefined : sorting.by,
      ordre:
        sorting.direction === defaultSorting?.direction
          ? undefined
          : sorting.direction,
      ...otherParams,
    })
