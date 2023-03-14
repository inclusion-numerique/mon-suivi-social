import { Link } from '@mss/web/components/Generic/Link'
import { PageTitle } from '@mss/web/components/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import {
  BeneficiaryTable,
  beneficiaryColumns,
} from '@mss/web/components/BeneficiaryTable'
import { redirect } from 'next/navigation'
import {
  Table,
  TableHeadWithSorting,
  getColumnOrderBy,
  Sorting,
  parseTableSearchParams,
  createTableLinks,
} from '@mss/web/components/Generic'
import { BeneficiarySearchBar } from '@mss/web/components/BeneficiarySearchBar'
import { BeneficiairesQuery } from '@mss/web/query'

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

  const { pageNumber, currentSorting, search } = parseTableSearchParams(
    searchParams,
    defaultSorting,
  )

  const { createPageLink, createSortLink } = createTableLinks(
    Routes.Beneficiaires.Index.pathWithParams,
    { pageNumber, currentSorting, defaultSorting, search },
  )

  const beneficiariesList = await BeneficiairesQuery.iterateBeneficiaries({
    perPage: itemsPerPage,
    page: pageNumber,
    orderBy: getColumnOrderBy(currentSorting, beneficiaryColumns),
    structureId,
    search,
  })

  // FIXME: Not sure if it is possible to factorise the following lines
  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > beneficiariesList.totalPages) {
    redirect(createPageLink(beneficiariesList.totalPages))
  }

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
