import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import z from 'zod'
import { prismaClient } from '@mss/web/prismaClient'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { AddBeneficiaryWithGeneralInfoServer } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.server'
import { EditBeneficiaryGeneralInfoClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.client'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { forbiddenError, invalidError } from '@mss/web/trpc/trpcErrors'
import { EditBeneficiaryGeneralInfoServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryGeneralInfo.server'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'
import { AddBeneficiaryWithFullDataServer } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.server'
import { EditBeneficiaryFullDataClient } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.client'
import { EditBeneficiaryFullDataServer } from '@mss/web/features/beneficiary/editBeneficiary/editBeneficiaryFullData.server'
import { ArchiveBeneficiaryClient } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.client'
import { ArchiveBeneficiaryServer } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.server'
import { canListBeneficiaries } from '@mss/web/security/rules'
import { beneficiaryDocumentRouter } from '@mss/web/trpc/routers/beneficiaryDocumentRouter'

const tokenToSearchCondition = (token: string) => {
  return {
    contains: token,
    mode: 'insensitive',
  }
}
export const beneficiaryRouter = router({
  search: protectedProcedure
    .input(z.object({ query: z.string(), structureId: z.string().uuid() }))
    .query(async ({ input: { query, structureId }, ctx: { user } }) => {
      if (!canListBeneficiaries(user, { structureId })) {
        throw forbiddenError()
      }
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

      // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
      // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
      const beneficiaries = await prismaClient.beneficiary.findMany({
        where: {
          structureId,
          archived: null,
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
  addWithGeneralInfo: protectedProcedure
    .input(AddBeneficiaryWithGeneralInfoClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      AddBeneficiaryWithGeneralInfoServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
        structureId: input.structureId,
      }),
    ),
  editGeneralInfo: protectedProcedure
    .input(EditBeneficiaryGeneralInfoClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }

      return EditBeneficiaryGeneralInfoServer.execute({
        input,
        user,
        getServerStateInput: input,
        target,
        securityParams: {},
        structureId: input.structureId,
        beneficiaryId: input.beneficiaryId,
      })
    }),
  addWithFullData: protectedProcedure
    .input(AddBeneficiaryWithFullDataClient.inputValidation)
    .mutation(({ input, ctx: { user } }) =>
      AddBeneficiaryWithFullDataServer.execute({
        input,
        user,
        target: input,
        securityParams: {},
        structureId: input.structureId,
      }),
    ),
  editFullData: protectedProcedure
    .input(EditBeneficiaryFullDataClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }

      return EditBeneficiaryFullDataServer.execute({
        input,
        user,
        target,
        securityParams: {},
        getServerStateInput: input,
        structureId: input.structureId,
        beneficiaryId: input.beneficiaryId,
      })
    }),
  archive: protectedProcedure
    .input(ArchiveBeneficiaryClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const beneficiary = await getBeneficiarySecurityTarget(
        input.beneficiaryId,
      )
      if (!beneficiary) {
        throw invalidError('Bénéficiaire introuvable')
      }

      return ArchiveBeneficiaryServer.execute({
        input,
        user,
        target: beneficiary,
        getServerStateInput: beneficiary,
        securityParams: {},
        structureId: beneficiary.structureId,
        beneficiaryId: input.beneficiaryId,
      })
    }),
  document: beneficiaryDocumentRouter,
})
