import Link from 'next/link'
import { ComponentProps } from 'react'

export type PaginationNavProps = ComponentProps<typeof PaginationNav>

export const PaginationNav = ({
  createPageLink,
  totalPages,
  pageNumber,
}: {
  pageNumber: number
  totalPages: number
  createPageLink: (pageNumber: number) => string
}) => {
  const isFirstPage = pageNumber <= 1
  const isLastPage = pageNumber >= totalPages

  const linkablePages = createPagesList(totalPages, pageNumber)

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
        {/*TODO display lg etc... from doc https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/pagination/*/}
        {linkablePages.map((linkNumber) =>
          linkNumber === null ? (
            <li>
              <a className="fr-pagination__link">...</a>
            </li>
          ) : (
            <li>
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

// Only display at most 6 pages numbered links
const createPagesList = (
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
