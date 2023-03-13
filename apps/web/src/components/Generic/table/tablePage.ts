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
  page?: any
  tri?: any
  ordre?: any
  recherche?: any
}

export const tablePage = (
  pathWithParams: PaginationSortingParams<
    SearchParams,
    'defaultSorting' | 'currentSorting' | 'pageNumber'
  >,
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

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper<SearchParams>(
    { currentSorting, defaultSorting, search },
    pathWithParams,
  )

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    pathWithParams,
  )

  return { pageNumber, currentSorting, search, createPageLink, createSortLink }
}
