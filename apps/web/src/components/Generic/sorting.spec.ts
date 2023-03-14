import { Routes } from '@mss/web/app/routing/routes'
import { createSortLinkHelper } from './sorting'
import { Sorting } from './table'

describe('sorting', () => {
  describe('createSortLinkHelper', () => {
    it('provides an helper that creates a sort link with no search params provided', () => {
      const sortLinkHelper = createSortLinkHelper(
        {},
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = sortLinkHelper({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toEqual('/beneficiaires?tri=name&ordre=asc')

      const sortLinkNameDesc = sortLinkHelper({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toEqual('/beneficiaires?tri=name&ordre=desc')

      const sortLinkDateAsc = sortLinkHelper({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toEqual('/beneficiaires?tri=date&ordre=asc')

      const sortLinkDateDesc = sortLinkHelper({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toEqual('/beneficiaires?tri=date&ordre=desc')
    })

    it('provides an helper that creates a sort link with default sorting', () => {
      const sortLinkHelper = createSortLinkHelper(
        { defaultSorting: { by: 'name', direction: 'asc' } },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = sortLinkHelper({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toEqual('/beneficiaires')

      const sortLinkNameDesc = sortLinkHelper({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toEqual('/beneficiaires?ordre=desc')

      const sortLinkDateAsc = sortLinkHelper({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toEqual('/beneficiaires?tri=date')

      const sortLinkDateDesc = sortLinkHelper({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toEqual('/beneficiaires?tri=date&ordre=desc')
    })

    it('provides an helper that creates a sort link that ignores the page number if it is the first page', () => {
      const sortLinkHelper = createSortLinkHelper(
        { pageNumber: 1 },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = sortLinkHelper({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toEqual('/beneficiaires?tri=name&ordre=asc')

      const sortLinkNameDesc = sortLinkHelper({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toEqual('/beneficiaires?tri=name&ordre=desc')

      const sortLinkDateAsc = sortLinkHelper({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toEqual('/beneficiaires?tri=date&ordre=asc')

      const sortLinkDateDesc = sortLinkHelper({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toEqual('/beneficiaires?tri=date&ordre=desc')
    })

    it('provides an helper that creates a sort link that keeps the page number if it is not the first page', () => {
      const sortLinkHelper = createSortLinkHelper(
        { pageNumber: 3 },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = sortLinkHelper({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toEqual(
        '/beneficiaires?page=3&tri=name&ordre=asc',
      )

      const sortLinkNameDesc = sortLinkHelper({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toEqual(
        '/beneficiaires?page=3&tri=name&ordre=desc',
      )

      const sortLinkDateAsc = sortLinkHelper({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toEqual(
        '/beneficiaires?page=3&tri=date&ordre=asc',
      )

      const sortLinkDateDesc = sortLinkHelper({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toEqual(
        '/beneficiaires?page=3&tri=date&ordre=desc',
      )
    })

    it('provides an helper that creates a sort link that keeps other parameters provided', () => {
      const sortLinkHelper = createSortLinkHelper<{
        pageNumber?: number
        defaultSorting?: Sorting
        recherche?: string
      }>({ recherche: 'foo' }, Routes.Beneficiaires.Index.pathWithParams)

      const sortLinkNameAsc = sortLinkHelper({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toEqual(
        '/beneficiaires?tri=name&ordre=asc&recherche=foo',
      )

      const sortLinkNameDesc = sortLinkHelper({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toEqual(
        '/beneficiaires?tri=name&ordre=desc&recherche=foo',
      )

      const sortLinkDateAsc = sortLinkHelper({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toEqual(
        '/beneficiaires?tri=date&ordre=asc&recherche=foo',
      )

      const sortLinkDateDesc = sortLinkHelper({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toEqual(
        '/beneficiaires?tri=date&ordre=desc&recherche=foo',
      )
    })
  })
})
