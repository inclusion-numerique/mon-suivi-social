import { protectedProcedure, router } from '@mss/web/trpc/trpc'
import { getBeneficiarySecurityTarget } from '@mss/web/security/getBeneficiarySecurityTarget'
import { invalidError } from '@mss/web/trpc/trpcErrors'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { AddHelpRequestServer } from '@mss/web/features/helpRequest/addHelpRequest.server'
import { EditHelpRequestClient } from '@mss/web/features/helpRequest/editHelpRequest.client'
import { EditHelpRequestServer } from '@mss/web/features/helpRequest/editHelpRequest.server'
import { prismaClient } from '@mss/web/prismaClient'
import {
  canViewBeneficiaryFollowupPrivateSynthesis,
  canViewBeneficiaryFollowupSynthesis,
} from '@mss/web/security/rules'

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
      const helpRequest = await prismaClient.helpRequest.findUniqueOrThrow({
        where: { id: input.helpRequestId },
        select: { createdById: true },
      })

      const includeSynthesis = canViewBeneficiaryFollowupSynthesis(
        user,
        target,
        helpRequest,
      )
      const includePrivateSynthesis =
        canViewBeneficiaryFollowupPrivateSynthesis(user, target, helpRequest)

      // TODO What would be a way to validate input with zod depending on canViewBeneficiaryFollowupSynthesis ?

      if (!includeSynthesis && input.synthesis) {
        throw invalidError()
      }
      if (!includePrivateSynthesis && input.privateSynthesis) {
        throw invalidError()
      }

      return EditHelpRequestServer.execute({
        input,
        user,
        target,
        getServerStateInput: {
          ...input,
          includeSynthesis,
          includePrivateSynthesis,
        },
        securityParams: helpRequest,
        structureId: target.structureId,
      })
    }),
})
