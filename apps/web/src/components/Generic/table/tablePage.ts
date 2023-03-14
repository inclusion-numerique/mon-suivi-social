import { RoutePathParams } from '@mss/web/app/routing/routes'
import { createPageLinkHelper } from '../pagination'
import { createSortLinkHelper } from '../sorting'
import { PaginationSortingParams } from '../tabs/paginationSortingParams'
import { Sorting } from './TableColumnDefinition'

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

export const createTableLinks = <T extends string>(
  pathWithParams: (
    params: PaginationSortingParams<
      SearchParams,
      'defaultSorting' | 'currentSorting' | 'pageNumber'
    >,
  ) => string,
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
  const createPageLink = createPageLinkHelper<SearchParams>(
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
