// Only display at most 6 pages numbered links
/**
 * A string return type means that no pageNumber is to display.
 * These are unique string so they can be used as "key" props in iterators.
 */
export const createPagesNumbersToDisplay = (
  totalPages: number,
  pageNumber: number,
): (number | string)[] => {
  // Small pages numbers, display all pages
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }).map((_, index) => index + 1)
  }

  // Page is at beginning or end of the list, only display one "..."
  if (pageNumber <= 3 || pageNumber >= totalPages - 2) {
    return [1, 2, 3, 'separator', totalPages - 2, totalPages - 1, totalPages]
  }

  // Page is in the middle, display it inside separators
  return [
    1,
    'separator1',
    pageNumber - 1,
    pageNumber,
    pageNumber + 1,
    'separator2',
    totalPages,
  ]
}

export const DEFAULT_PER_PAGE = 15
