import Link from 'next/link'
import BeneficiariesSearchBar from '@mss/web/app/(private)/beneficiaires/BeneficiariesSearchBar'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { PaginatedTable } from '@mss/web/ui/PaginatedTable'
import { PropsWithChildren } from 'react'
import { BeneficiariesListTableRows } from '@mss/web/app/(private)/beneficiaires/(list)/BeneficiariesListTableRows'
import { beneficiariesListTableColumns } from '@mss/web/app/(private)/beneficiaires/(list)/beneficiariesListTableColumns'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { redirect } from 'next/navigation'

// TODO Generic helper
export type PaginationParams = {
  page?: string
  recherche?: string
  tri?: string
  ordre?: 'asc' | 'desc'
}

const itemsPerPage = 10

const BeneficiariesListPage = async ({
  searchParams,
  children,
}: PropsWithChildren<{
  searchParams?: RoutePathParams<
    typeof Routes.Structure.Beneficiaires.Index.pathWithParams
  >
}>) => {
  const user = await getAuthenticatedAgent()
  const structureId = user.structureId

  const defaultSortBy = 'Nom'
  const defaultSortDirection = 'asc'

  const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1
  const search = searchParams?.recherche
  const sortBy = searchParams?.tri ?? defaultSortBy
  const sortDirection = searchParams?.ordre ?? defaultSortDirection

  const where = { structureId }

  const beneficiariesCount = await prismaClient.beneficiary.count({
    where,
  })

  const take = itemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  const totalPages = Math.ceil(beneficiariesCount / itemsPerPage) || 1

  // TODO Where to put this logic ?
  const createPageLink = (toPage: number) =>
    Routes.Structure.Beneficiaires.Index.pathWithParams({
      page: toPage === 1 ? undefined : toPage.toString(),
      tri: sortBy === defaultSortBy ? undefined : sortBy,
      ordre: sortDirection === defaultSortDirection ? undefined : sortDirection,
    })

  // TODO where to put this redirect logic ?
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  const createSortLink = (by: string, direction: 'asc' | 'desc') =>
    Routes.Structure.Beneficiaires.Index.pathWithParams({
      page: pageNumber === 1 ? undefined : pageNumber.toString(),
      tri: by === defaultSortBy ? undefined : by,
      ordre: direction === defaultSortDirection ? undefined : direction,
    })

  // TODO Sorting logic in other components
  const sortByColumnDefinition = beneficiariesListTableColumns.find(
    ({ label }) => label === sortBy,
  )
  const sortByParameter =
    !!sortByColumnDefinition && 'sortable' in sortByColumnDefinition
      ? sortByColumnDefinition.sortable(sortDirection)
      : undefined

  const tableHead = (
    <tr>
      {beneficiariesListTableColumns.map(({ label, sortable }) => (
        <th key={label}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {nonBreakable(label)}&nbsp;
            {sortable ? (
              <Link
                className={`fr-btn fr-btn--tertiary-no-outline fr-btn--sm ${
                  sortBy !== label || sortDirection !== 'desc'
                    ? 'fr-icon-arrow-down-line'
                    : 'fr-icon-arrow-up-line'
                }`}
                title={`Trier par ${label.toLowerCase()}, ordre ${
                  sortBy !== label || sortDirection === 'desc'
                    ? 'croissant'
                    : 'décroissant'
                }`}
                href={createSortLink(
                  label,
                  sortBy !== label || sortDirection === 'desc' ? 'asc' : 'desc',
                )}
                style={{
                  color:
                    sortBy !== label ? 'var(--text-disabled-grey)' : undefined,
                }}
              />
            ) : null}
          </div>
        </th>
      ))}
    </tr>
  )

  const tableBody = (
    <BeneficiariesListTableRows
      user={user}
      queryInput={{
        take,
        skip,
        structureId,
        search,
        sortBy: sortByParameter,
      }}
    />
  )

  return (
    <>
      <PageTitle page={Routes.Structure.Beneficiaires.Index} />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div
              className="fr-grid-row fr-grid-row--gutters"
              style={{ display: 'flex' }}
            >
              <div className="fr-col-12 fr-col-md-8">
                <BeneficiariesSearchBar />
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-btns-group fr-btns-group--icon-left">
                  <Link
                    className="fr-btn fr-icon-user-add-line fr-mb-0"
                    href={Routes.Structure.Beneficiaires.Nouveau.path}
                  >
                    {Routes.Structure.Beneficiaires.Nouveau.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-card fr-mt-4v">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <p className="fr-hint-text fr-mb-0">
              {beneficiariesCount} bénéficiaire
              {beneficiariesCount === 1 ? '' : 's'}
            </p>
            <PaginatedTable
              pageNumber={pageNumber}
              totalPages={totalPages}
              tableHead={tableHead}
              tableBody={tableBody}
              createPageLink={createPageLink}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default BeneficiariesListPage
