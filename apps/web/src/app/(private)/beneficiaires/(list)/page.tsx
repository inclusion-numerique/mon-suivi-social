import Link from 'next/link'
import BeneficiariesSearchBar from '@mss/web/app/(private)/beneficiaires/BeneficiariesSearchBar'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { BeneficiariesListTableRows } from '@mss/web/app/(private)/beneficiaires/(list)/BeneficiariesListTableRows'
import { beneficiariesListTableColumns } from '@mss/web/app/(private)/beneficiaires/(list)/beneficiariesListTableColumns'
import { redirect } from 'next/navigation'
import { Table } from '@mss/web/ui/table/Table'
import {
  getColumnOrderBy,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'
import { ListBeneficiariesFeatureClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'
import {
  createPageLinkHelper,
  takeAndSkipFromPagination,
} from '@mss/web/ui/pagination'
import { createSortLinkHelper } from '@mss/web/ui/sorting'

const itemsPerPage = 10

const defaultSorting: Sorting = {
  by: 'Nom',
  direction: 'asc',
}

const BeneficiariesListPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Structure.Beneficiaires.Index.pathWithParams
  >
}) => {
  const user = await getAuthenticatedAgent()
  const structureId = user.structureId

  // TODO We could put all this in a big list page helper function...

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const beneficiariesCount = await prismaClient.beneficiary.count({
    where: { structureId },
  })

  // Create pagination parameters

  const totalPages = Math.ceil(beneficiariesCount / itemsPerPage) || 1

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Structure.Beneficiaires.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Structure.Beneficiaires.Index.pathWithParams,
  )

  // Query input parameters

  const queryInput: ListBeneficiariesFeatureClient.Input = {
    structureId,
    search,
    ...takeAndSkipFromPagination({ itemsPerPage, pageNumber }),
    orderBy: getColumnOrderBy(currentSorting, beneficiariesListTableColumns),
  }

  const tableHead = (
    <TableHeadWithSorting
      columns={beneficiariesListTableColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = <BeneficiariesListTableRows queryInput={queryInput} />

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
            <Table
              tableHead={tableHead}
              tableBody={tableBody}
              pagination={{ pageNumber, totalPages, createPageLink }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default BeneficiariesListPage
