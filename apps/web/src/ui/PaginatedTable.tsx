import Link from 'next/link'
import { ReactNode } from 'react'
import styles from '@mss/web/ui/PaginatedTable.module.css'

// Only display at most 6 links
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

  // Page is in the middle, display it in separators
  return [1, null, pageNumber - 1, pageNumber, pageNumber + 1, null, totalPages]
}

export const PaginatedTable = ({
  tableHead,
  tableBody,
  tableFooter,
  createPageLink,
  totalPages,
  pageNumber,
}: {
  // 1 indexed
  pageNumber: number
  totalPages: number
  tableHead: ReactNode
  tableBody: ReactNode
  tableFooter?: ReactNode
  createPageLink: (pageNumber: number) => string
}) => {
  const isFirstPage = pageNumber <= 1
  const isLastPage = pageNumber >= totalPages

  const linkablePages = createPagesList(totalPages, pageNumber)

  return (
    <>
      <div className="fr-table fr-table--bordered fr-mb-4v">
        <table className={styles.table}>
          <thead>{tableHead}</thead>
          <tbody>{tableBody}</tbody>
          {tableFooter ? <tfoot>{tableFooter}</tfoot> : null}
        </table>
      </div>
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
    </>
  )
}
