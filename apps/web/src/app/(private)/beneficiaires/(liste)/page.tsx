import Link from 'next/link'
import { PageTitle } from '@mss/web/components/PageTitle/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import {
  BeneficiaryTable,
  beneficiaryColumns,
} from '@mss/web/components/BeneficiaryTable'
import { redirect } from 'next/navigation'
import { Table } from '@mss/web/ui/table/Table'
import {
  getColumnOrderBy,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'
import { createPageLinkHelper } from '@mss/web/ui/pagination'
import { createSortLinkHelper } from '@mss/web/ui/sorting'
import { ListBeneficiariesServer } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.server'
import { BeneficiarySearchBar } from '@mss/web/components/BeneficiarySearchBar'

const itemsPerPage = 15

const defaultSorting: Sorting = {
  by: 'Nom',
  direction: 'asc',
}

const BeneficiariesListPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Beneficiaires.Index.pathWithParams
  >
}) => {
  const user = await getAuthenticatedAgent()
  const { structureId } = user

  // TODO We could put all this in a big list page helper function...

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const beneficiariesList = await ListBeneficiariesServer.execute({
    user,
    input: {
      perPage: itemsPerPage,
      page: pageNumber,
      orderBy: getColumnOrderBy(currentSorting, beneficiaryColumns),
      structureId,
      search,
    },
    securityParams: { structureId },
  })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Beneficiaires.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > beneficiariesList.totalPages) {
    redirect(createPageLink(beneficiariesList.totalPages))
    return null
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Beneficiaires.Index.pathWithParams,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={beneficiaryColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = (
    <BeneficiaryTable beneficiaries={beneficiariesList.beneficiaries} />
  )

  return (
    <>
      <PageTitle page={Routes.Beneficiaires.Index} />
      <div className="fr-card">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div
              className="fr-grid-row fr-grid-row--gutters"
              style={{ display: 'flex' }}
            >
              <div className="fr-col-12 fr-col-md-8">
                <BeneficiarySearchBar structureId={structureId} />
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-btns-group fr-btns-group--icon-left">
                  <Link
                    className="fr-btn fr-icon-user-add-line fr-mb-0"
                    href={Routes.Beneficiaires.Nouveau.path}
                  >
                    {Routes.Beneficiaires.Nouveau.title}
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
              {beneficiariesList.count} bénéficiaire
              {beneficiariesList.count === 1 ? '' : 's'}
            </p>
            <Table
              tableHead={tableHead}
              tableBody={tableBody}
              pagination={{
                pageNumber,
                totalPages: beneficiariesList.totalPages,
                createPageLink,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default BeneficiariesListPage
