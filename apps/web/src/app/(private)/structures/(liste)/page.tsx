import { PageTitle } from '@mss/web/components/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { canListStructures } from '@mss/web/security/rules'
import { notFound, redirect } from 'next/navigation'
import {
  getColumnOrderBy,
  Sorting,
  createPageLinkHelper,
  createSortLinkHelper,
  TableHeadWithSorting,
  Table,
} from '@mss/web/components/Generic'
import {
  structureColumns,
  StructureTable,
} from '@mss/web/components/StructureTable'
import Link from 'next/link'
import { StructureQuery } from '@mss/web/query'

const itemsPerPage = 15

const defaultSorting: Sorting = {
  by: 'Nom',
  direction: 'asc',
}

const StructuresListPage = async ({
  searchParams,
}: {
  searchParams?: RoutePathParams<typeof Routes.Structures.Index.pathWithParams>
}) => {
  const user = await getAuthenticatedAgent()
  if (!canListStructures(user)) {
    notFound()
  }

  // TODO We could put all this in a big list page helper function...

  // Get pagination and sorting info from searchParams
  const pageNumber = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  // Get filters info from searchParams
  const search = searchParams?.recherche

  const { structures, totalPages, count } =
    await StructureQuery.iterateStructures({
      perPage: itemsPerPage,
      page: pageNumber,
      orderBy: getColumnOrderBy(currentSorting, structureColumns),
    })

  // Linking logic for pages navigation
  const createPageLink = createPageLinkHelper(
    { currentSorting, defaultSorting, search },
    Routes.Structures.Index.pathWithParams,
  )

  // Redirect to last page if pageNumber is outside of bounds
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
  }

  // Linking logic for sorting
  const createSortLink = createSortLinkHelper(
    { pageNumber, defaultSorting, search },
    Routes.Structures.Index.pathWithParams,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={structureColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = <StructureTable structures={structures} />

  return (
    <>
      <PageTitle page={Routes.Structures.Index} />
      <div className="fr-card fr-mt-4v">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="fr-hint-text fr-mb-0">
                {count} structure
                {count === 1 ? '' : 's'}
              </p>
              <Link
                className="fr-btn fr-btn--icon-left fr-icon-building-line fr-mb-0"
                href={Routes.Structures.Ajouter.path}
              >
                Ajouter une structure
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
export default StructuresListPage
