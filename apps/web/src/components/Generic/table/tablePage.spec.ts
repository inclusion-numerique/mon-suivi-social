import { Routes } from '@mss/web/app/routing/routes'
import { createPageLinkHelper, createSortLinkHelper } from './tablePage'

describe('tablePage', () => {
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
      const sortLinkHelper = createSortLinkHelper(
        { recherche: 'foo' },
        Routes.Beneficiaires.Index.pathWithParams,
      )

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

  describe('createPageLinkHelper', () => {
    it('provides an helper that creates a page link that ignores the page number if it is the first page', () => {
      const pageLinkHelper = createPageLinkHelper(
        {},
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstPage = pageLinkHelper(1)

      expect(pageLinkFirstPage).toEqual('/beneficiaires')
    })

    it('provides an helper that creates a page link with the page number if it is not the first page', () => {
      const pageLinkHelper = createPageLinkHelper(
        {},
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkThirdPage = pageLinkHelper(3)

      expect(pageLinkThirdPage).toEqual('/beneficiaires?page=3')
    })

    it('provides an helper that creates a page link that keeps the current sorting', () => {
      const pageLinkHelper = createPageLinkHelper(
        { currentSorting: { by: 'name', direction: 'asc' } },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirst = pageLinkHelper(1)

      expect(pageLinkFirst).toEqual('/beneficiaires?tri=name&ordre=asc')

      const pageLinkThird = pageLinkHelper(3)

      expect(pageLinkThird).toEqual('/beneficiaires?page=3&tri=name&ordre=asc')
    })

    it('provides an helper that creates a page link that keeps the current sorting with default sorting', () => {
      const pageLinkHelperNotDefaultSorting = createPageLinkHelper(
        {
          currentSorting: { by: 'date', direction: 'desc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstNotDefaultSorting = pageLinkHelperNotDefaultSorting(1)

      expect(pageLinkFirstNotDefaultSorting).toEqual(
        '/beneficiaires?tri=date&ordre=desc',
      )

      const pageLinkThirdNotDefaultSorting = pageLinkHelperNotDefaultSorting(3)

      expect(pageLinkThirdNotDefaultSorting).toEqual(
        '/beneficiaires?page=3&tri=date&ordre=desc',
      )

      const pageLinkHelperDefaultSortingBy = createPageLinkHelper(
        {
          currentSorting: { by: 'name', direction: 'desc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstDefaultSortingBy = pageLinkHelperDefaultSortingBy(1)

      expect(pageLinkFirstDefaultSortingBy).toEqual('/beneficiaires?ordre=desc')

      const pageLinkThirdDefaultSortingBy = pageLinkHelperDefaultSortingBy(3)

      expect(pageLinkThirdDefaultSortingBy).toEqual(
        '/beneficiaires?page=3&ordre=desc',
      )

      const pageLinkHelperDefaultSortingDirection = createPageLinkHelper(
        {
          currentSorting: { by: 'name', direction: 'desc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstDefaultSortingDirection =
        pageLinkHelperDefaultSortingDirection(1)

      expect(pageLinkFirstDefaultSortingDirection).toEqual(
        '/beneficiaires?ordre=desc',
      )

      const pageLinkThirdDefaultSortingDirection =
        pageLinkHelperDefaultSortingBy(3)

      expect(pageLinkThirdDefaultSortingDirection).toEqual(
        '/beneficiaires?page=3&ordre=desc',
      )

      const pageLinkHelperDefaultSorting = createPageLinkHelper(
        {
          currentSorting: { by: 'name', direction: 'asc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstDefaultSorting = pageLinkHelperDefaultSorting(1)

      expect(pageLinkFirstDefaultSorting).toEqual('/beneficiaires')

      const pageLinkThirdDefaultSorting = pageLinkHelperDefaultSorting(3)

      expect(pageLinkThirdDefaultSorting).toEqual('/beneficiaires?page=3')
    })

    it('provides an helper that creates a page link that keeps other parameters provided', () => {
      const pageLinkHelper = createPageLinkHelper(
        { recherche: 'foo' },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirst = pageLinkHelper(1)

      expect(pageLinkFirst).toEqual('/beneficiaires?recherche=foo')

      const pageLinkThird = pageLinkHelper(3)

      expect(pageLinkThird).toEqual('/beneficiaires?page=3&recherche=foo')
    })
  })
})
