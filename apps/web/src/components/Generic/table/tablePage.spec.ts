import { Routes } from '@mss/web/app/routing/routes'
import { createTableLinks } from './tablePage'

describe('tablePage', () => {
  describe('createTableLinks', () => {
    it('provides helpers that create sort and page links with no search params provided', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        {},
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires?tri=name&ordre=asc')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?tri=name&ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?tri=date&ordre=asc')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?tri=date&ordre=desc')

      const pageLinkFirstPage = createPageLink(1)

      expect(pageLinkFirstPage).toBe('/beneficiaires')

      const pageLinkThirdPage = createPageLink(3)

      expect(pageLinkThirdPage).toBe('/beneficiaires?page=3')
    })

    it('provides helpers that create sort and page links with default sorting', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        { defaultSorting: { by: 'name', direction: 'asc' } },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?tri=date')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?tri=date&ordre=desc')

      const pageLinkFirstPage = createPageLink(1)

      expect(pageLinkFirstPage).toBe('/beneficiaires')

      const pageLinkThirdPage = createPageLink(3)

      expect(pageLinkThirdPage).toBe('/beneficiaires?page=3')
    })

    it('provides helpers that create sort and page links that ignore the page number if it is the first page', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        { pageNumber: 1 },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires?tri=name&ordre=asc')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?tri=name&ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?tri=date&ordre=asc')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?tri=date&ordre=desc')

      const pageLinkFirstPage = createPageLink(1)

      expect(pageLinkFirstPage).toBe('/beneficiaires')

      const pageLinkThirdPage = createPageLink(3)

      expect(pageLinkThirdPage).toBe('/beneficiaires?page=3')
    })

    it('provides helpers that create sort and page links that keep the page number if it is not the first page', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        { pageNumber: 3 },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires?page=3&tri=name&ordre=asc')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?page=3&tri=name&ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?page=3&tri=date&ordre=asc')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?page=3&tri=date&ordre=desc')

      const pageLinkFirstPage = createPageLink(1)

      expect(pageLinkFirstPage).toBe('/beneficiaires')

      const pageLinkThirdPage = createPageLink(3)

      expect(pageLinkThirdPage).toBe('/beneficiaires?page=3')
    })

    it('provides helpers that create sort and page links that keep other parameters provided', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        { tab: 'foo', search: 'baz' },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe(
        '/beneficiaires?tri=name&ordre=asc&search=baz&tab=foo',
      )

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe(
        '/beneficiaires?tri=name&ordre=desc&search=baz&tab=foo',
      )

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe(
        '/beneficiaires?tri=date&ordre=asc&search=baz&tab=foo',
      )

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe(
        '/beneficiaires?tri=date&ordre=desc&search=baz&tab=foo',
      )

      const pageLinkFirst = createPageLink(1)

      expect(pageLinkFirst).toBe('/beneficiaires?search=baz&tab=foo')

      const pageLinkThird = createPageLink(3)

      expect(pageLinkThird).toBe('/beneficiaires?page=3&search=baz&tab=foo')
    })

    it('provides an helper that creates a page link that keep the current sorting', () => {
      const { createSortLink, createPageLink } = createTableLinks(
        { currentSorting: { by: 'name', direction: 'asc' } },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires?tri=name&ordre=asc')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?tri=name&ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?tri=date&ordre=asc')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?tri=date&ordre=desc')

      const pageLinkFirst = createPageLink(1)

      expect(pageLinkFirst).toBe('/beneficiaires?tri=name&ordre=asc')

      const pageLinkThird = createPageLink(3)

      expect(pageLinkThird).toBe('/beneficiaires?page=3&tri=name&ordre=asc')
    })

    it('provide helpers that create sort and page links that keep the current sorting with default sorting', () => {
      const {
        createPageLink: createPageLinkNotDefaultSorting,
        createSortLink,
      } = createTableLinks(
        {
          currentSorting: { by: 'date', direction: 'desc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?ordre=desc')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?tri=date')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?tri=date&ordre=desc')

      const pageLinkFirstNotDefaultSorting = createPageLinkNotDefaultSorting(1)

      expect(pageLinkFirstNotDefaultSorting).toBe(
        '/beneficiaires?tri=date&ordre=desc',
      )

      const pageLinkThirdNotDefaultSorting = createPageLinkNotDefaultSorting(3)

      expect(pageLinkThirdNotDefaultSorting).toBe(
        '/beneficiaires?page=3&tri=date&ordre=desc',
      )

      const { createPageLink: createPageLinkDefaultSortingBy } =
        createTableLinks(
          {
            currentSorting: { by: 'name', direction: 'desc' },
            defaultSorting: { by: 'name', direction: 'asc' },
          },
          Routes.Beneficiaires.Index.pathWithParams,
        )

      const pageLinkFirstDefaultSortingBy = createPageLinkDefaultSortingBy(1)

      expect(pageLinkFirstDefaultSortingBy).toBe('/beneficiaires?ordre=desc')

      const pageLinkThirdDefaultSortingBy = createPageLinkDefaultSortingBy(3)

      expect(pageLinkThirdDefaultSortingBy).toBe(
        '/beneficiaires?page=3&ordre=desc',
      )

      const { createPageLink: createPageLinkDefaultSortingDirection } =
        createTableLinks(
          {
            currentSorting: { by: 'name', direction: 'desc' },
            defaultSorting: { by: 'name', direction: 'asc' },
          },
          Routes.Beneficiaires.Index.pathWithParams,
        )

      const pageLinkFirstDefaultSortingDirection =
        createPageLinkDefaultSortingDirection(1)

      expect(pageLinkFirstDefaultSortingDirection).toBe(
        '/beneficiaires?ordre=desc',
      )

      const pageLinkThirdDefaultSortingDirection =
        createPageLinkDefaultSortingBy(3)

      expect(pageLinkThirdDefaultSortingDirection).toBe(
        '/beneficiaires?page=3&ordre=desc',
      )

      const { createPageLink: createPageLinkDefaultSorting } = createTableLinks(
        {
          currentSorting: { by: 'name', direction: 'asc' },
          defaultSorting: { by: 'name', direction: 'asc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const pageLinkFirstDefaultSorting = createPageLinkDefaultSorting(1)

      expect(pageLinkFirstDefaultSorting).toBe('/beneficiaires')

      const pageLinkThirdDefaultSorting = createPageLinkDefaultSorting(3)

      expect(pageLinkThirdDefaultSorting).toBe('/beneficiaires?page=3')
    })

    it('provide helpers that create sort and page links - exhaustive example', () => {
      const { createPageLink, createSortLink } = createTableLinks(
        {
          pageNumber: 4,
          currentSorting: { by: 'date', direction: 'desc' },
          defaultSorting: { by: 'name', direction: 'desc' },
        },
        Routes.Beneficiaires.Index.pathWithParams,
      )

      const sortLinkNameAsc = createSortLink({
        by: 'name',
        direction: 'asc',
      })

      expect(sortLinkNameAsc).toBe('/beneficiaires?page=4&ordre=asc')

      const sortLinkNameDesc = createSortLink({
        by: 'name',
        direction: 'desc',
      })

      expect(sortLinkNameDesc).toBe('/beneficiaires?page=4')

      const sortLinkDateAsc = createSortLink({
        by: 'date',
        direction: 'asc',
      })

      expect(sortLinkDateAsc).toBe('/beneficiaires?page=4&tri=date&ordre=asc')

      const sortLinkDateDesc = createSortLink({
        by: 'date',
        direction: 'desc',
      })

      expect(sortLinkDateDesc).toBe('/beneficiaires?page=4&tri=date')

      const pageLinkFirstNotDefaultSorting = createPageLink(1)

      expect(pageLinkFirstNotDefaultSorting).toBe('/beneficiaires?tri=date')

      const pageLinkThirdNotDefaultSorting = createPageLink(3)

      expect(pageLinkThirdNotDefaultSorting).toBe(
        '/beneficiaires?page=3&tri=date',
      )
    })
  })
})
