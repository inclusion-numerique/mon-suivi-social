import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { invalidError } from '@mss/web/trpc/trpcErrors'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { AddHelpRequestServer } from '@mss/web/features/helpRequest/addHelpRequest.server'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { EditHelpRequestServer } from '@mss/web/features/helpRequest/editHelpRequest.server'
import { prismaClient } from '@mss/web/prismaClient'

export const helpRequestRouter = router({
  add: protectedProcedure
    .input(AddHelpRequestClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      return AddHelpRequestServer.execute({
        input,
        user,
        target,
        securityParams: {},
        structureId: target.structureId,
      })
    }),
  edit: protectedProcedure
    .input(EditHelpRequestClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      const document = await prismaClient.helpRequest.findUniqueOrThrow({
        where: { id: input.helpRequestId },
        select: { createdById: true },
      })

      return EditHelpRequestServer.execute({
        input,
        user,
        target,
        getServerStateInput: input,
        securityParams: document,
        structureId: target.structureId,
      })
    }),
})
