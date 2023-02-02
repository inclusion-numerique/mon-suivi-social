// Only display at most 6 pages numbered links
import { SortDirection, Sorting } from '@mss/web/ui/table/TableColumnDefinition'

export const createPagesNumbersToDisplay = (
  totalPages: number,
  pageNumber: number,
): (number | null)[] => {
  // Small pages numbers, display all pages
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }).map((_, index) => index + 1)
  }

  // Page is at beginning or end of the list, only display one "..."
  if (pageNumber <= 3 || pageNumber >= totalPages - 2) {
    return [1, 2, 3, null, totalPages - 2, totalPages - 1, totalPages]
  }

  // Page is in the middle, display it inside separators
  return [1, null, pageNumber - 1, pageNumber, pageNumber + 1, null, totalPages]
}

export const takeAndSkipFromPagination = ({
  pageNumber,
  itemsPerPage,
}: {
  pageNumber: number
  itemsPerPage: number
}): { take: number; skip: number } => {
  return { take: itemsPerPage, skip: (pageNumber - 1) * itemsPerPage }
}

// TODO clean this and factorize with sorting helper for default removal logic that helps cache hits
export const createPageLinkHelper =
  <T extends { currentSorting?: Sorting; defaultSorting?: Sorting }>(
    { currentSorting, defaultSorting, ...otherParams }: T,
    paramsToLink: (
      params: { page?: string; tri?: string; ordre?: SortDirection } & Omit<
        T,
        'defaultSorting' | 'currentSorting'
      >,
    ) => string,
  ) =>
  (toPage: number) =>
    paramsToLink({
      page: toPage === 1 ? undefined : toPage.toString(),
      tri:
        !currentSorting || currentSorting.by === defaultSorting?.by
          ? undefined
          : currentSorting.by,
      ordre:
        !currentSorting ||
        currentSorting.direction === defaultSorting?.direction
          ? undefined
          : currentSorting.direction,
      ...otherParams,
    })
