import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { invalidError } from '@mss/web/trpc/trpcErrors'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'
import { AddFollowupServer } from '@mss/web/features/followup/addFollowup.server'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { EditFollowupServer } from '@mss/web/features/followup/editFollowup.server'
import { prismaClient } from '@mss/web/prismaClient'

export const followupRouter = router({
  add: protectedProcedure
    .input(AddFollowupClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      return AddFollowupServer.execute({
        input,
        user,
        target,
        securityParams: {},
        structureId: target.structureId,
      })
    }),
  edit: protectedProcedure
    .input(EditFollowupClient.inputValidation)
    .mutation(async ({ input, ctx: { user } }) => {
      const target = await getBeneficiarySecurityTarget(input.beneficiaryId)
      if (!target) {
        throw invalidError('Beneficiary not found')
      }
      const document = await prismaClient.followup.findUniqueOrThrow({
        where: { id: input.followupId },
        select: { createdById: true },
      })

      return EditFollowupServer.execute({
        input,
        user,
        target,
        getServerStateInput: input,
        securityParams: document,
        structureId: target.structureId,
      })
    }),
})
