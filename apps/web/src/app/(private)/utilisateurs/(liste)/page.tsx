import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canListUsers } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { createPageLinkHelper } from '@mss/web/ui/pagination'
import { createSortLinkHelper } from '@mss/web/ui/sorting'
import { ListUsersServer } from '@mss/web/features/user/listUsers/listUsers.server'
import { usersListTableColumns } from '@mss/web/app/(private)/utilisateurs/(liste)/usersListTableColumns'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'
import { structuresListTableColumns } from '@mss/web/app/(private)/structures/(liste)/structuresListTableColumns'
import { StructuresListTableRows } from '@mss/web/app/(private)/structures/(liste)/StructuresListTableRows'
import Link from 'next/link'
import { Table } from '@mss/web/ui/table/Table'
import { UsersListTableRows } from '@mss/web/app/(private)/utilisateurs/(liste)/UsersListTableRows'

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
    return null
  }

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const { users, totalPages, count } = await ListUsersServer.execute({
    user,
    input: {
      structureId,
      perPage: itemsPerPage,
      page: pageNumber,
      orderBy: getColumnOrderBy(currentSorting, usersListTableColumns),
      search,
    },
    securityParams: {},
  })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Utilisateurs.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Utilisateurs.Index.pathWithParams,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={usersListTableColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = <UsersListTableRows users={users} />

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
