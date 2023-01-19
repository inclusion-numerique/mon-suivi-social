import { prismaClient } from '@mss/web/prismaClient'
import { v4 } from 'uuid'
import z from 'zod'
import { protectedProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'
import { BeneficiaryDataValidation } from '@mss/web/beneficiary/beneficiary'
import { generateFileNumber } from '@mss/web/beneficiary/generateFileNumber'
import { SessionUser, SessionUserAgent } from '@mss/web/auth/sessionUser'

const enforceUserHasAccessToOrganisation = (
  user: SessionUser,
  organisationId: string,
): user is SessionUserAgent => {
  if (!user.organisationId || organisationId !== user.organisationId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot access this organisation',
    })
  }
  return true
}

const enforceUserHasOrganisation = (user: SessionUser): string => {
  if (!user.organisationId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'No organisation',
    })
  }
  return user.organisationId
}

const tokenToSearchCondition = (token: string) => {
  return {
    contains: token,
    mode: 'insensitive',
  }
}

export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query }, ctx: { user } }) => {
      const organisationId = enforceUserHasOrganisation(user)

      // TODO unit test
      const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

      const fields = [
        'firstName',
        'birthName',
        'usualName',
        'fileNumber',
      ] as const

      const searchConditions = tokens.map((token) => ({
        OR: fields.map((field) => ({
          [field]: tokenToSearchCondition(token),
        })),
      }))

      // TODO benchmark this and stress tes, then create indexes for cas-insensitive filtering.
      // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
      const beneficiaries = await prismaClient.beneficiary.findMany({
        where: {
          organisationId,
          AND: searchConditions,
        },
        orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
        select: {
          id: true,
          usualName: true,
          firstName: true,
          birthName: true,
          fileNumber: true,
        },
      })

      return { beneficiaries }
    }),
  add: protectedProcedure
    .input(BeneficiaryDataValidation)
    .mutation(
      async ({
        input: {
          status,
          aidantConnectAuthorized,
          organisationId,
          agentId,
          additionalInformation,
        },
        ctx: { user },
      }) => {
        enforceUserHasAccessToOrganisation(user, organisationId)
        const id = v4()
        const fileNumber = generateFileNumber()
        const beneficiary = await prismaClient.beneficiary.create({
          data: {
            id,
            organisationId,
            fileNumber,
            status,
            aidantConnectAuthorized,
            agentId,
            additionalInformation,
          },
        })

        return { beneficiary }
      },
    ),
})

export const appRouter = router({
  beneficiary: beneficiaryRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
