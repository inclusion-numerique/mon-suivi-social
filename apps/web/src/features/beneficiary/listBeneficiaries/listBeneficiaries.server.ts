import { prismaClient } from '@mss/web/prismaClient'
import { QueryFeature } from '@mss/web/features/feature'
import { ListBeneficiariesFeatureClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'

const executeQuery = async ({
  queryInput: { structureId, take, skip, orderBy },
}: {
  queryInput: ListBeneficiariesFeatureClient.Input
}) => {
  const beneficiaries = await prismaClient.beneficiary.findMany({
    where: { structureId, archived: null },
    select: {
      id: true,
      usualName: true,
      birthName: true,
      firstName: true,
      birthDate: true,
      streetNumber: true,
      street: true,
      zipcode: true,
      city: true,
      phone1: true,
      phone2: true,
      status: true,
      fileNumber: true,
      referents: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
        },
      },
      followups: {
        select: { type: { select: { id: true, name: true } } },
        distinct: ['typeId'],
      },
      helpRequests: {
        select: { type: { select: { id: true, name: true } } },
        distinct: ['typeId'],
      },
      _count: {
        select: { followups: true, helpRequests: true, referents: true },
      },
    },
    take,
    skip,
    orderBy,
  })

  return { beneficiaries }
}

const executeCountQuery = ({
  structureId,
}: Pick<ListBeneficiariesFeatureClient.Input, 'structureId'>) =>
  prismaClient.beneficiary.count({
    where: { structureId, archived: null },
  })

export type ListBeneficiariesItem =
  ListBeneficiariesFeatureServer.QueryResult['beneficiaries'][number]

export const ListBeneficiariesFeatureServer = {
  executeQuery,
  executeCountQuery,
}

export namespace ListBeneficiariesFeatureServer {
  export type QueryResult = Awaited<ReturnType<typeof executeQuery>>
}

export const ListBeneficiariesFeature = {
  ...ListBeneficiariesFeatureClient,
  ...ListBeneficiariesFeatureServer,
} satisfies QueryFeature<
  ListBeneficiariesFeatureClient.Input,
  {},
  ListBeneficiariesFeatureServer.QueryResult
>
