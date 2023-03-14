import { PageTitle } from '@mss/web/components/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canListUsers } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
  createPageLinkHelper,
  createSortLinkHelper,
  Table,
  TableHeadWithSorting,
} from '@mss/web/components/Generic'
import { Link } from '@mss/web/components/Generic/Link'
import { UserTable, userTableColumns } from '@mss/web/components/UserTable'
import { iterateUsers } from '@mss/web/query/utilisateurs/iterateUsers'

const itemsPerPage = 15

const defaultSorting: Sorting = {
  by: 'Nom',
  direction: 'asc',
}

const ListeDesUtilisateursPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Utilisateurs.Index.pathWithParams
  >
}) => {
  const user = await getAuthenticatedAgent()
  const { structureId } = user
  if (!canListUsers(user, { structureId })) {
    notFound()
  }

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const { users, totalPages, count } = await iterateUsers({
    perPage: itemsPerPage,
    page: pageNumber,
    orderBy: getColumnOrderBy(currentSorting, userTableColumns),
  })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Utilisateurs.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Utilisateurs.Index.pathWithParams,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={userTableColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = <UserTable users={users} />

  return (
    <>
      <PageTitle page={Routes.Utilisateurs.Index} />
      <div className="fr-card fr-mt-4v">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="fr-hint-text fr-mb-0">
                {count} utilisateur
                {count === 1 ? '' : 's'}
              </p>
              <Link
                className="fr-btn fr-btn--icon-left fr-icon-user-add-line fr-mb-0"
                href={Routes.Utilisateurs.Ajouter.path}
              >
                Ajouter un utilisateur
              </Link>
            </div>
            <Table
              tableHead={tableHead}
              tableBody={tableBody}
              pagination={{
                pageNumber,
                totalPages,
                createPageLink,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ListeDesUtilisateursPage
