import { PageTitle } from '@mss/web/components/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canListUsers } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
  Table,
  TableHeadWithSorting,
  parseTableSearchParams,
  createTableLinks,
} from '@mss/web/components/Generic'
import { Link } from '@mss/web/components/Generic/Link'
import { UserTable, userTableColumns } from '@mss/web/components/UserTable'
import { iterateUsers } from '@mss/web/server/query/utilisateurs/iterateUsers'
import { DEFAULT_PER_PAGE } from '@mss/web/components/Generic/pagination'

const perPage = DEFAULT_PER_PAGE

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

  const { pageNumber, currentSorting, search } = parseTableSearchParams(
    searchParams,
    defaultSorting,
  )

  const { createPageLink, createSortLink } = createTableLinks(
    { pageNumber, currentSorting, defaultSorting, search },
    Routes.Utilisateurs.Index.pathWithParams,
  )

  const { users, totalPages, count } = await iterateUsers({
    perPage,
    page: pageNumber,
    orderBy: getColumnOrderBy(currentSorting, userTableColumns),
  })

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
  }

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
