import { RoutePathParams } from '@mss/web/app/routing/routes'
import { SortDirection, Sorting } from './TableColumnDefinition'

type SearchParams = {
  pageNumber?: number
  currentSorting?: Sorting
  defaultSorting?: Sorting
  search?: any
  tab?: any
  page?: any
  tri?: any
  ordre?: any
  recherche?: any
}

export type PaginationSortingParams = {
  page?: string
  tri?: string
  ordre?: SortDirection
} & Omit<SearchParams, 'defaultSorting' | 'pageNumber' | 'currentSorting'>

/**
 * Create the parameters object from the page, the sorting and other search params.
 * It removes page or sorting parameters if they equals to default values
 * @param param0 An object made of the page and the sorting
 * @param param1 An object made of the default sorting and the remaining search params
 * @returns An object made of
 *     - page: the page parameter (undefined if it is the first page)
 *     - tri: the field used for sorting (undefined if it equals the default sorting field)
 *     - ordre: the sorting order (undefined if is equals the default sorting order)
 *     - ... the remaining search params
 */
const createParameters = (
  { page, sorting }: { page: number | undefined; sorting: Sorting | undefined },
  { defaultSorting, ...otherParameters }: SearchParams,
): PaginationSortingParams => ({
  page: page === 1 ? undefined : page?.toString(),
  tri: sorting?.by === defaultSorting?.by ? undefined : sorting?.by,
  ordre:
    sorting?.direction === defaultSorting?.direction
      ? undefined
      : sorting?.direction,
  ...otherParameters,
})

/**
 * Build a helper function that allows to create links that redirect to a specific sort
 * @param param0 An object made of the page number, the default sorting and other search params
 * @param parametersToLink A route function used to build the link string from search params, based on a specific sort
 */
export const createSortLinkHelper =
  (
    { pageNumber, defaultSorting, ...otherParameters }: SearchParams,
    parametersToLink: (params: PaginationSortingParams) => string,
  ) =>
  (sorting: Sorting) =>
    parametersToLink(
      createParameters(
        { sorting, page: pageNumber },
        { defaultSorting, ...otherParameters },
      ),
    )

/**
 * Build a helper function that allows to create links that redirect to a specific page
 * @param param0 An object made of the current sorting, the default sorting and other search params
 * @param parametersToLink A route function used to build the link string from search params, based on a specific page number
 */
export const createPageLinkHelper =
  (
    { currentSorting, defaultSorting, ...otherParameters }: SearchParams,
    parametersToLink: (params: PaginationSortingParams) => string,
  ) =>
  (toPage: number) =>
    parametersToLink(
      createParameters(
        { page: toPage, sorting: currentSorting },
        { defaultSorting, ...otherParameters },
      ),
    )

export const parseTableSearchParams = (
  searchParams: RoutePathParams<(params: SearchParams) => any> | undefined,
  defaultSorting: Sorting,
) => {
  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  return { pageNumber, currentSorting, search }
}

/**
 * An object made of :
 *     - createPageLink: a helper function that allows to create links that redirect to a specific page
 *     - createSortLink: a helper function that allows to create links that redirect to a specific sort
 * @param pathWithParams A route function used to build the link string from search params, based on a specific page number or a specific sort
 * @param param1 A set of parsed search params
 */
export const createTableLinks = <T extends string>(
  pathWithParams: (params: PaginationSortingParams) => string,
  {
    pageNumber,
    currentSorting,
    defaultSorting,
    search,
    tab,
  }: {
    pageNumber: number
    currentSorting: Sorting
    defaultSorting: Sorting
    search?: string
    tab?: T
  },
) => {
  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search, tab },
    pathWithParams,
  )

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search, tab },
    pathWithParams,
  )

  return { createPageLink, createSortLink }
}
