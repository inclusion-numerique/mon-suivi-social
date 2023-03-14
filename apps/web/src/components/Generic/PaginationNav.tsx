import { Link } from '@mss/web/components/Generic/Link'
import { ComponentProps } from 'react'
import { createPagesNumbersToDisplay } from './pagination'

export type PaginationNavProps = ComponentProps<typeof PaginationNav>

export function PaginationNav({
  createPageLink,
  totalPages,
  pageNumber,
}: {
  pageNumber: number
  totalPages: number
  createPageLink: (pageNumber: number) => string
}) {
  const isFirstPage = pageNumber <= 1
  const isLastPage = pageNumber >= totalPages

  const linkablePages = createPagesNumbersToDisplay(totalPages, pageNumber)

  return (
    <nav role="navigation" aria-label="Pagination" className="fr-pagination">
      <ul className="fr-pagination__list">
        <li>
          {isFirstPage ? (
            <a
              className="fr-pagination__link fr-pagination__link--first"
              aria-disabled="true"
              role="link"
            >
              Première page
            </a>
          ) : (
            <Link
              className="fr-pagination__link fr-pagination__link--first"
              role="link"
              href={createPageLink(1)}
            >
              Première page
            </Link>
          )}
        </li>
        <li>
          {isFirstPage ? (
            <a
              className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
              aria-disabled="true"
              role="link"
            >
              Page précédente
            </a>
          ) : (
            <Link
              className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
              role="link"
              href={createPageLink(pageNumber - 1)}
            >
              Page précédente
            </Link>
          )}
        </li>
        {/* TODO display lg etc... from doc https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/pagination/ */}
        {linkablePages.map((linkNumber) =>
          typeof linkNumber === 'string' ? (
            <li key={linkNumber}>
              <a className="fr-pagination__link">...</a>
            </li>
          ) : (
            <li key={linkNumber}>
              <Link
                className="fr-pagination__link"
                aria-current={pageNumber === linkNumber ? 'page' : undefined}
                title={`Page ${linkNumber}`}
                href={createPageLink(linkNumber)}
              >
                {linkNumber}
              </Link>
            </li>
          ),
        )}
        <li>
          {isLastPage ? (
            <a
              className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
              aria-disabled="true"
              role="link"
            >
              Page suivante
            </a>
          ) : (
            <Link
              className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
              role="link"
              href={createPageLink(pageNumber + 1)}
            >
              Page suivante
            </Link>
          )}
        </li>
        <li>
          {isLastPage ? (
            <a
              className="fr-pagination__link fr-pagination__link--last"
              aria-disabled="true"
              role="link"
            >
              Dernière page
            </a>
          ) : (
            <Link
              className="fr-pagination__link fr-pagination__link--last"
              role="link"
              href={createPageLink(totalPages)}
            >
              Dernière page
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}
