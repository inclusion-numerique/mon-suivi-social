import { protectedProcedure, router } from '@mss/web/server/createRouter'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { invalidError } from '@mss/web/server/trpcErrors'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'
import { AddFollowupServer } from '@mss/web/features/followup/addFollowup.server'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { EditFollowupServer } from '@mss/web/features/followup/editFollowup.server'
import { prismaClient } from '@mss/web/prismaClient'
import {
  canViewBeneficiaryFollowupPrivateSynthesis,
  canViewBeneficiaryFollowupSynthesis,
} from '@mss/web/security/rules'

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
      const followup = await prismaClient.followup.findUniqueOrThrow({
        where: { id: input.followupId },
        select: { createdById: true },
      })

      const includeSynthesis = canViewBeneficiaryFollowupSynthesis(
        user,
        target,
        followup,
      )
      const includePrivateSynthesis =
        canViewBeneficiaryFollowupPrivateSynthesis(user, target, followup)

      // TODO What would be a way to validate input with zod depending on canViewBeneficiaryFollowupSynthesis ?

      if (!includeSynthesis && input.synthesis) {
        throw invalidError()
      }
      if (!includePrivateSynthesis && input.privateSynthesis) {
        throw invalidError()
      }

      return EditFollowupServer.execute({
        input,
        user,
        target,
        getServerStateInput: {
          ...input,
          includeSynthesis,
          includePrivateSynthesis,
        },
        securityParams: followup,
        structureId: target.structureId,
      })
    }),
})
