import Link from 'next/link'
import BeneficiariesSearchBar from '@mss/web/app/(private)/beneficiaires/BeneficiariesSearchBar'
import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { PropsWithChildren } from 'react'
import { BeneficiariesListTableRows } from '@mss/web/app/(private)/beneficiaires/(list)/BeneficiariesListTableRows'
import { beneficiariesListTableColumns } from '@mss/web/app/(private)/beneficiaires/(list)/beneficiariesListTableColumns'
import { redirect } from 'next/navigation'
import { Table } from '@mss/web/ui/table/Table'
import {
  getColumnOrderBy,
  SortDirection,
  Sorting,
} from '@mss/web/ui/table/TableColumnDefinition'
import { TableHeadWithSorting } from '@mss/web/ui/table/TableHeadWithSorting'

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
}: {
  searchParams?: RoutePathParams<
    typeof Routes.Structure.Beneficiaires.Index.pathWithParams
  >
}) => {
  const user = await getAuthenticatedAgent()
  const structureId = user.structureId

  const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1

  const defaultSorting: Sorting = {
    by: 'Nom',
    direction: 'asc',
  }

  const currentSorting: Sorting = {
    by: searchParams?.tri ?? defaultSorting.by,
    direction: searchParams?.ordre ?? defaultSorting.direction,
  }

  const search = searchParams?.recherche

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
      tri:
        currentSorting.by === defaultSorting.by ? undefined : currentSorting.by,
      ordre:
        currentSorting.direction === defaultSorting.direction
          ? undefined
          : currentSorting.direction,
    })

  // TODO where to put this redirect logic ?
  if (pageNumber > totalPages) {
    redirect(createPageLink(totalPages))
    return null
  }

  const createSortLink = (by: string, direction: SortDirection) =>
    Routes.Structure.Beneficiaires.Index.pathWithParams({
      page: pageNumber === 1 ? undefined : pageNumber.toString(),
      tri: by === defaultSorting.by ? undefined : by,
      ordre: direction === defaultSorting.direction ? undefined : direction,
    })

  const orderBy = getColumnOrderBy(
    currentSorting,
    beneficiariesListTableColumns,
  )

  const tableHead = (
    <TableHeadWithSorting
      columns={beneficiariesListTableColumns}
      createSortLink={createSortLink}
      currentSorting={currentSorting}
    />
  )

  const tableBody = (
    <BeneficiariesListTableRows
      user={user}
      queryInput={{
        take,
        skip,
        structureId,
        search,
        orderBy,
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
